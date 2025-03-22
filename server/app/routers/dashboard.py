from fastapi import APIRouter, Depends, HTTPException
from app.schemas.dashboard import HeatmapResponse, TrendResponse
from app.utils.dependencies import get_current_user
from app.database import SessionLocal
from app.models.task import Task
from datetime import datetime
import calendar
from sqlalchemy import func, extract

router = APIRouter(tags=["Dashboard"])

def get_actual_month_days(year: int, month: int):
    """Get number of days in specified month/year"""
    _, num_days = calendar.monthrange(year, month)
    return num_days

@router.get("/dashboard/heatmap", response_model=HeatmapResponse)
async def get_heatmap_data(
    year: int = datetime.now().year,
    month: int = datetime.now().month,
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()
    try:
        # Get actual missed tasks per day
        missed_tasks_query = db.query(
            Task.created_day,
            func.count(Task.id).label('missed_count')
        ).filter(
            Task.created_year == year,
            Task.created_month == month,
            Task.status == 'missed'
        ).group_by(Task.created_day).all()

        # Create dictionary of day:count
        missed_counts = {day: count for day, count in missed_tasks_query}
        
        # Get valid days for the month
        num_days = get_actual_month_days(year, month)
        days = list(range(1, num_days + 1))
        
        # Build response with actual data
        missed_tasks = [missed_counts.get(day, 0) for day in days]
        
        return {"days": days, "missed_tasks": missed_tasks}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.get("/dashboard/trends", response_model=TrendResponse)
async def get_trend_data(
    year: int = datetime.now().year,
    month: int = datetime.now().month,
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()
    try:
        # Get all tasks for the month
        tasks = db.query(Task).filter(
            Task.created_year == year,
            Task.created_month == month
        ).all()

        # Initialize weekly buckets
        weeks = {}
        for task in tasks:
            week_number = (task.created_day - 1) // 7 + 1
            if week_number not in weeks:
                weeks[week_number] = {'completed': 0, 'missed': 0}
            
            if task.status == 'completed':
                weeks[week_number]['completed'] += 1
            elif task.status == 'missed':
                weeks[week_number]['missed'] += 1

        # Create sorted response
        max_weeks = 4 if month != 2 else 5  # Handle February differently if needed
        labels = [f"Week {i}" for i in range(1, max_weeks + 1)]
        completed = [weeks.get(i, {'completed': 0})['completed'] for i in range(1, max_weeks + 1)]
        missed = [weeks.get(i, {'missed': 0})['missed'] for i in range(1, max_weeks + 1)]

        return {
            "labels": labels,
            "completed": completed,
            "missed": missed
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()