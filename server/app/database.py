from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)

create_tables()  # Ensure tables exist

# Add this function
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()