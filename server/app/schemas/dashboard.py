from pydantic import BaseModel

class HeatmapResponse(BaseModel):
    days: list[int]
    missed_tasks: list[int]

class TrendResponse(BaseModel):
    labels: list[str]
    completed: list[int]
    missed: list[int]