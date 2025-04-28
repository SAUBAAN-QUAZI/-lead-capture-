from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict
import datetime
import re

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    message: str
    captured_lead_info: Optional[Dict] = None
    
class LeadCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    interests: Optional[str] = None
    conversation: Optional[str] = None
    
    @validator('email')
    def validate_email(cls, v):
        if v is None:
            return v
        # Simple regex for email validation
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError('Invalid email format')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        if v is None:
            return v
        # Remove non-digit characters for validation
        digits_only = re.sub(r'\D', '', v)
        # Check if it has a reasonable number of digits (7-15)
        if len(digits_only) < 7 or len(digits_only) > 15:
            raise ValueError('Phone number should have 7-15 digits')
        return v

class LeadResponse(BaseModel):
    id: int
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    interests: Optional[str] = None
    created_at: datetime.datetime
    
    class Config:
        from_attributes = True 