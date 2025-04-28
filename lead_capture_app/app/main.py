from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from .database import get_db, create_tables, Lead
from .schemas import ChatRequest, ChatResponse, LeadCreate, LeadResponse
from .ai_service import LeadCaptureAgent

# Initialize FastAPI app
app = FastAPI(title="Charity Lead Capture API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://lead-capture-gamma.vercel.app"],  # For development - restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables
create_tables()

# Initialize AI service
lead_agent = LeadCaptureAgent()

# Helper function to convert ChatMessage objects to dict for JSON serialization
def convert_chat_messages_to_dict(messages):
    result = []
    for msg in messages:
        if hasattr(msg, 'role') and hasattr(msg, 'content'):
            # It's a ChatMessage object
            result.append({"role": msg.role, "content": msg.content})
        elif isinstance(msg, dict) and 'role' in msg and 'content' in msg:
            # It's already a dict with the right structure
            result.append(msg)
    return result

@app.get("/")
def read_root():
    return {"message": "Welcome to the Charity Lead Capture API"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Chat with the lead capture agent and store captured lead information.
    """
    try:
        # Process message with OpenAI
        result = lead_agent.chat(
            user_message=request.message,
            conversation_history=request.conversation_history
        )
        
        # Extract captured lead info if available
        lead_info = result.get("captured_lead_info")
        
        # If lead info was captured, store or update in database
        if lead_info and any(lead_info.values()):
            # Create a new lead or update existing one
            
            # Convert conversation history to JSON-serializable format
            serializable_history = convert_chat_messages_to_dict(request.conversation_history)
            
            lead_data = LeadCreate(
                name=lead_info.get("name"),
                email=lead_info.get("email"),
                phone=lead_info.get("phone"),
                interests=lead_info.get("interests"),
                # Store the conversation for context
                conversation=json.dumps(serializable_history)
            )
            
            # Check if we already have this lead in the database
            existing_lead = None
            if lead_info.get("email"):
                existing_lead = db.query(Lead).filter(Lead.email == lead_info.get("email")).first()
            elif lead_info.get("phone"):
                existing_lead = db.query(Lead).filter(Lead.phone == lead_info.get("phone")).first()
                
            if existing_lead:
                # Update existing lead with new information
                if lead_info.get("name") and not existing_lead.name:
                    existing_lead.name = lead_info.get("name")
                if lead_info.get("email") and not existing_lead.email:
                    existing_lead.email = lead_info.get("email")
                if lead_info.get("phone") and not existing_lead.phone:
                    existing_lead.phone = lead_info.get("phone")
                if lead_info.get("interests"):
                    if existing_lead.interests:
                        existing_lead.interests += f"; {lead_info.get('interests')}"
                    else:
                        existing_lead.interests = lead_info.get("interests")
                existing_lead.conversation = json.dumps(serializable_history)
                db.commit()
            else:
                # Create new lead
                db_lead = Lead(**lead_data.dict())
                db.add(db_lead)
                db.commit()
                db.refresh(db_lead)
        
        return ChatResponse(
            message=result["message"],
            captured_lead_info=lead_info
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat: {str(e)}"
        )

@app.get("/leads", response_model=List[LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    """
    Get all captured leads.
    """
    leads = db.query(Lead).all()
    return leads

@app.get("/leads/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Get a specific lead by ID.
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead 