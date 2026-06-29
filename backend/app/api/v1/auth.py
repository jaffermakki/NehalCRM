from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class PinLoginRequest(BaseModel):
    pin: str
    store_id: str

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # In a real app, query the User model
    # user = db.query(User).filter(User.username == payload.username).first()
    
    # Mocking successful admin login for MVP
    if payload.username == "admin" and payload.password == "admin":
        access_token = create_access_token(subject="admin-uuid")
        return {"access_token": access_token, "token_type": "bearer", "role": "Admin"}
        
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/pin-login")
def pin_login(payload: PinLoginRequest, db: Session = Depends(get_db)):
    """Quick login for cashiers at the POS."""
    # staff = db.query(User).filter(User.pin_hash == hash(payload.pin)).first()
    
    if payload.pin == "1234":
        access_token = create_access_token(subject="cashier-uuid")
        return {"access_token": access_token, "token_type": "bearer", "role": "Cashier"}
        
    raise HTTPException(status_code=401, detail="Invalid PIN")
