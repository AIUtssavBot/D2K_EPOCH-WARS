from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, prediction, task, dashboard
from app.database import engine
from app.models import user, task as task_model

user.Base.metadata.create_all(bind=engine)
task_model.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(prediction.router)
app.include_router(task.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Facility Management System API"}