from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from app.utils.dependencies import get_current_user
from app.utils.scheduler import GeneticScheduler
from app.schemas.task import TaskCreate, TaskScheduleOutput, UncompletedTask
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(tags=["Tasks"])

def convert_to_schedule_format(tasks: List[TaskCreate]):
    return [{
        "task_id": str(i),
        "task_name": task.task_name,
        "priority": {"High": 3, "Medium": 2, "Low": 1}[task.urgency],
        "est_time": task.estimated_duration,
        "deadline": task.deadline.replace(tzinfo=None)  # Remove timezone for compatibility
    } for i, task in enumerate(tasks)]

def format_output(assigned, unassigned):
    scheduled = []
    current_time = datetime.now().replace(microsecond=0)
    
    for task in assigned:
        end_time = current_time + timedelta(hours=task['est_time'])
        scheduled.append(TaskScheduleOutput(
            task_name=task['task_name'],
            urgency={3: 'High', 2: 'Medium', 1: 'Low'}[task['priority']],
            deadline=task['deadline'],
            start_time=current_time,
            end_time=end_time,
            duration=task['est_time']
        ))
        current_time = end_time
    
    uncompleted = []
    for task in unassigned:
        uncompleted.append(UncompletedTask(
            task_name=task['task_name'],
            reason="Insufficient time before deadline"
        ))
    
    return {"scheduled": scheduled, "uncompleted": uncompleted}

@router.post("/schedule", response_model=dict)
async def create_schedule(
    tasks: List[TaskCreate],
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)  # Add database dependency
):
    try:
        print("Received tasks:", tasks)
        formatted_tasks = convert_to_schedule_format(tasks)
        print("Formatted tasks:", formatted_tasks)
        
        assigned, unassigned = GeneticScheduler.schedule_tasks(formatted_tasks)
        print("Assigned tasks:", assigned)
        print("Unassigned tasks:", unassigned)
        
        GeneticScheduler.save_to_db(assigned, unassigned)
        return format_output(assigned, unassigned)
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Scheduling failed: {str(e)}"
        )