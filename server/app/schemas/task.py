from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import datetime

class TaskCreate(BaseModel):
    task_name: str
    urgency: str
    estimated_duration: int
    deadline: datetime

    @field_serializer('deadline')
    def serialize_deadline(self, deadline: datetime):
        return deadline.isoformat()

class TaskScheduleOutput(BaseModel):
    task_name: str
    urgency: str
    deadline: datetime
    start_time: datetime
    end_time: datetime
    duration: int

    @field_serializer('deadline', 'start_time', 'end_time')
    def serialize_datetime(self, dt: datetime):
        return dt.isoformat()

class UncompletedTask(BaseModel):
    task_name: str
    reason: str
    model_config = ConfigDict(from_attributes=True)