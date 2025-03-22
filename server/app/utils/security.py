from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.config import settings
from app.models.user import User
from app.database import get_db

# Configure CryptContext with correct parameters
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__rounds=4,          # Number of iterations (time cost)
    argon2__memory_cost=1024,  # 1GB memory usage
    argon2__parallelism=2,     # Number of parallel threads
    argon2__salt_size=16       # Size of random salt
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return {"email": email}

# Add this function at the end of the file
def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """
    Optional: Add additional checks for active users here
    Example: Check if user is disabled/active in DB
    """
    # You could add database checks here
    db = get_db()
    db_user = db.query(User).filter(User.email == current_user["email"]).first()
    if not db_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user