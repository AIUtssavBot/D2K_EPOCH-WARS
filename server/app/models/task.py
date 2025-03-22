from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String(100), nullable=False)
    urgency = Column(String(10), nullable=False)
    estimated_duration = Column(Integer, nullable=False)
    deadline = Column(DateTime, nullable=False)
    status = Column(String(20), default="pending")
    created_year = Column(Integer, nullable=False)
    created_month = Column(Integer, nullable=False)
    created_day = Column(Integer, nullable=False)
    
    def __repr__(self):
        return f"<Task {self.task_name} ({self.status})>"