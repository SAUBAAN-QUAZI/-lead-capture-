from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
import traceback
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import time

# Load environment variables from .env file
load_dotenv()

from .database import get_db, create_tables, Lead
from .schemas import ChatRequest, ChatResponse, LeadCreate, LeadResponse
from .ai_service import LeadCaptureAgent, get_openai_client

# Initialize FastAPI app
app = FastAPI(title="Charity Lead Capture API")

# Get allowed origins from environment or use defaults
def get_allowed_origins():
    # Default origins
    origins = [
        "http://localhost:3000",             # Next.js local dev
        "http://127.0.0.1:3000",             # Next.js local dev alternative
        "https://lead-capture-gamma.vercel.app"  # Production frontend
    ]
    
    # Add any custom origins from environment variable
    if os.getenv("ALLOWED_ORIGINS"):
        custom_origins = os.getenv("ALLOWED_ORIGINS").split(",")
        origins.extend([origin.strip() for origin in custom_origins])
    
    print(f"CORS: Allowing origins: {origins}")
    return origins

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),  # Dynamic origins based on environment
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
        
        # If we got a fallback message due to API errors, return it without trying to process lead info
        if "I'm having trouble connecting right now" in result["message"]:
            return ChatResponse(
                message=result["message"],
                captured_lead_info=None
            )
            
        # Extract captured lead info if available
        lead_info = result.get("captured_lead_info")
        
        # If lead info was captured, store or update in database
        if lead_info and any(lead_info.values()):
            try:
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
            except Exception as db_error:
                # If database operations fail, log the error but still return the chat response
                print(f"Database error: {str(db_error)}")
                print(traceback.format_exc())
                # Continue execution to return the chat response
        
        return ChatResponse(
            message=result["message"],
            captured_lead_info=lead_info
        )
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        print(traceback.format_exc())
        # Return a more user-friendly error
        return ChatResponse(
            message="I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
            captured_lead_info=None
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

@app.get("/test-openai")
async def test_openai_connection():
    """Test the OpenAI connection directly"""
    try:
        client = get_openai_client()
        print("DIAGNOSTIC: OpenAI client created successfully")
        
        # First, try a simple models list call
        try:
            print("DIAGNOSTIC: Testing models endpoint")
            models = client.models.list()
            print(f"DIAGNOSTIC: Models endpoint successful, found {len(models.data)} models")
        except Exception as e:
            print(f"DIAGNOSTIC: Models endpoint failed: {str(e)}")
        
        # Then try a chat completion
        print("DIAGNOSTIC: Testing chat completions endpoint")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'Connection successful'"}],
            max_tokens=20
        )
        print("DIAGNOSTIC: Chat completion successful")
        
        return {
            "status": "success", 
            "response": response.choices[0].message.content,
            "api_key_prefix": os.getenv("OPENAI_API_KEY")[:5] + "..." if os.getenv("OPENAI_API_KEY") else "None"
        }
    except Exception as e:
        print(f"DIAGNOSTIC: Test endpoint error: {str(e)}")
        print(f"DIAGNOSTIC: Error type: {type(e).__name__}")
        
        return {
            "status": "error", 
            "error": str(e),
            "error_type": type(e).__name__,
            "api_key_prefix": os.getenv("OPENAI_API_KEY")[:5] + "..." if os.getenv("OPENAI_API_KEY") else "None"
        }

@app.get("/health")
async def health_check():
    """
    Health check endpoint that provides detailed backend status information.
    This helps the frontend determine if the backend is operational.
    """
    try:
        # Check basic API functionality
        client = get_openai_client()
        openai_status = "healthy"
    except Exception as e:
        openai_status = f"error: {str(e)}"
    
    # Check database connection
    db_status = "unknown"
    try:
        # Get DB session
        db = next(get_db())
        # Test a simple query
        db.execute("SELECT 1").fetchall()
        db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    # Deployment information
    env = os.getenv("ENVIRONMENT", "development")
    
    return {
        "status": "operational",
        "environment": env,
        "version": "1.0.0",
        "timestamp": time.time(),
        "components": {
            "database": db_status,
            "openai_api": openai_status
        }
    } 