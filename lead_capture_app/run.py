import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Debug: Print if API key was loaded successfully
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print(f"OpenAI API key loaded (starts with {api_key[:5]}...)")
else:
    print("WARNING: OpenAI API key not found in environment variables!")
    
if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    print(f"Starting Charity Lead Capture API on {host}:{port}")
    print("Make sure to set your OPENAI_API_KEY in the environment variables")
    
    uvicorn.run("app.main:app", host=host, port=port, reload=True) 