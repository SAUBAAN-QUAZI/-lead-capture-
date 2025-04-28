import os
import openai
import json
from typing import Dict, List, Optional, Union
import re

# Function to initialize OpenAI client with API key
def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    print(f"Using API key starting with: {api_key[:5]}...")  # Print first few chars to verify key is loaded
    return openai.OpenAI(api_key=api_key)

# System prompt that defines the charity lead capture agent's behavior
SYSTEM_PROMPT = """You are a friendly and helpful assistant for a charity foundation. 
Your primary goal is to provide information about the charity's mission, programs, and how people can get involved.

While conversing with users, gradually and naturally collect the following information:
1. Their name
2. Their email address
3. Their phone number
4. Their areas of interest related to charity work

Important guidelines:
- Be warm, empathetic, and informative
- Never be pushy when asking for information
- Respect if users don't want to share certain details
- Provide valuable information about the charity's work
- Focus on how the charity helps communities in need
- Answer questions about volunteer opportunities, donations, and programs
- Keep responses concise and friendly

When providing information about the charity, emphasize its impact on communities, success stories, and how contributions make a difference.
"""

class LeadCaptureAgent:
    def __init__(self):
        self.client = get_openai_client()
        self.model = "gpt-3.5-turbo"  # Can be upgraded to gpt-4 for better results
    
    def chat(self, user_message: str, conversation_history: List[Dict[str, str]] = None) -> Dict:
        """
        Process a user message and generate a response while trying to capture lead information.
        
        Args:
            user_message: The latest message from the user
            conversation_history: Previous messages in the conversation
            
        Returns:
            Dict containing the assistant's response and any captured lead information
        """
        if conversation_history is None:
            conversation_history = []
        
        # Prepare the messages for the OpenAI API
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add conversation history
        for msg in conversation_history:
            messages.append(msg)
        
        # Add the latest user message
        messages.append({"role": "user", "content": user_message})
        
        # Add a special instruction to extract lead info
        extract_info_prompt = """
        After responding to the user, extract any lead information you've gathered in this conversation.
        If you've identified any of the following, include them in JSON format:
        - name
        - email
        - phone
        - interests
        
        Format it as: [LEAD_INFO]{"name": "...", "email": "...", "phone": "...", "interests": "..."}[/LEAD_INFO]
        Only include fields where you have information. Place this at the very end of your response, 
        separate from your regular message.
        """
        
        messages.append({
            "role": "system", 
            "content": extract_info_prompt
        })
        
        try:
            # Get response from OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=800
            )
            
            # Extract the assistant's message
            assistant_message = response.choices[0].message.content
            
            # Extract lead info JSON if present
            lead_info = None
            pattern = r'\[LEAD_INFO\](.*?)\[\/LEAD_INFO\]'
            match = re.search(pattern, assistant_message, re.DOTALL)
            
            if match:
                try:
                    lead_info_str = match.group(1)
                    lead_info = json.loads(lead_info_str)
                    # Remove the lead info section from the response
                    assistant_message = re.sub(pattern, '', assistant_message, flags=re.DOTALL).strip()
                except json.JSONDecodeError:
                    lead_info = None
            
            return {
                "message": assistant_message,
                "captured_lead_info": lead_info
            }
        except Exception as e:
            print(f"Error calling OpenAI API: {str(e)}")
            # Return a fallback response for debugging
            return {
                "message": f"I'm sorry, there was an error processing your request. Error: {str(e)}",
                "captured_lead_info": None
            } 