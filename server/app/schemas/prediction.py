from pydantic import BaseModel, Field

class PredictionInput(BaseModel):
    role: int = Field(..., ge=0, le=3)
    assigned_team: int = Field(..., ge=1, le=10)
    access_level: int = Field(..., ge=1, le=3)
    created_month: int = Field(..., ge=1, le=12)
    team_user_count: int = Field(..., ge=1)
    workload_hours: int = Field(..., ge=0)
    created_year: int = Field(..., ge=2020)
    created_day: int = Field(..., ge=1, le=31)
    last_login_year: int = Field(..., ge=2020)
    last_login_month: int = Field(..., ge=1, le=12)
    last_login_day: int = Field(..., ge=1, le=31)

class PredictionOutput(BaseModel):
    status: str  # "active" or "inactive"