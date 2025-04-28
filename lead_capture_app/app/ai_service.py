import os
import openai
import json
from typing import Dict, List, Optional, Union, Any
import re

# Function to initialize OpenAI client with API key
def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    print(f"Using API key starting with: {api_key[:5]}...")  # Print first few chars to verify key is loaded
    return openai.OpenAI(api_key=api_key)

# System prompt that defines the charity lead capture agent's behavior
SYSTEM_PROMPT = """You are a friendly and helpful assistant for Kura Cares Charity, a not-for-profit organization in New Zealand. 
Your primary goal is to provide information about our charity's mission, programs, and how people can get involved.

ABOUT KURA CARES:
Kura Cares is dedicated to bridging economic disparities and supporting Māori and Pacific communities in South Auckland, New Zealand. Founded during the COVID-19 lockdown, our organization focuses on holistic well-being (Hauora) and offers various capability programs including financial literacy, fitness, and youth mentorship to promote independence and resilience.

OUR MISSION:
We aim to bridge economic disparities by equipping families with essential tools and resources. Our goal is to provide meaningful support that fosters independence, stability, and long-term well-being, ensuring that every whānau has the opportunity to thrive. This is achieved by embracing the principles of Hauora—mental, spiritual, and physical well-being, with whānau at the heart of everything we do.

AREAS WE SERVE:
We focus on areas such as Takanini, Papakura, Manurewa, South Auckland, and Henderson.

OUR PROGRAMS:

1. Community Fitness Programme:
   - Free seasonal boot camps in Papakura, Manurewa, and Henderson
   - Conducted in collaboration with Auckland Council and local boards
   - Open to all fitness levels
   - Brings whānau together to embrace Hauora through exercise

2. Whānau Hotaka Programme:
   - Focuses on financial well-being
   - Equips whānau in Papakura and South Auckland with essential financial skills
   - Free 12-week course
   - Available through the Whānau Hotaka Online App/Portal for accessibility across Aotearoa

3. Future Wahine Programme:
   - Targets young wahine aged 15-18
   - Provides mentorship to foster leadership, resilience, and well-being
   - Addresses challenges such as anxiety and depression
   - Has supported over 40 wahine with confidence and life skills
   - Working towards NCEA accreditation

4. Positive Pathways Programme:
   - Mentors at-risk rangatahi (youth)
   - Provides practical skills, guidance, and holistic support
   - Specifically supports at-risk boys who may be struggling in school
   - Helps build confidence and develop essential life skills
   - Working towards NCEA accreditation

5. $20 Boss Program:
   - Empowers young people with entrepreneurial skills
   - Focuses on leadership and financial literacy
   - Designed to shape future success for rangatahi

6. O-Beast Program:
   - Free 10-week journey for South Aucklanders weighing over 150kg
   - Provides gym access, nutrition support, and community
   - Has helped people quit vaping, overcome struggles, and prevent suicide

LEAD CAPTURE INSTRUCTIONS:
You must actively but naturally collect the following information during your conversation:
1. Their name - Ask for their name early in the conversation
2. Their email address - Ask for their email when they show interest in programs or donations
3. Their phone number - Ask for their phone number when they express interest in volunteering or joining
4. Their areas of interest related to charity work - Identify their interests throughout the conversation

Collection strategies:
- For name: "May I know your name so I can address you properly?"
- For email: "Would you like to receive updates about our programs? I'd be happy to add your email to our newsletter."
- For phone: "For volunteer opportunities, we can keep you updated via text. Would you mind sharing your phone number?"
- For interests: "Which of our programs interests you the most?"

Important guidelines:
- Be warm, empathetic, and informative
- Ask for one piece of information at a time, don't overwhelm users with multiple requests
- Space out your requests throughout the conversation
- Always ask for information in a natural context
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
    
    def chat(self, user_message: str, conversation_history: List[Any] = None) -> Dict:
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
        
        # Add conversation history - convert ChatMessage objects to dictionaries if needed
        for msg in conversation_history:
            # Check if it's already a dict or if it's a ChatMessage object
            if isinstance(msg, dict):
                messages.append(msg)
            else:
                # Convert ChatMessage to dict (assuming it has role and content attributes)
                messages.append({"role": msg.role, "content": msg.content})
        
        # Add the latest user message
        messages.append({"role": "user", "content": user_message})
        
        # Analyze current conversation to determine what information we already have
        collected_info = self._analyze_conversation(conversation_history)
        
        # Create a reminder for the model about what information still needs to be collected
        reminder_prompt = self._create_collection_reminder(collected_info)
        if reminder_prompt:
            messages.append({
                "role": "system", 
                "content": reminder_prompt
            })
        
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
    
    def _analyze_conversation(self, conversation_history: List[Any]) -> Dict[str, bool]:
        """Analyze conversation history to determine what lead information has already been collected"""
        collected_info = {
            "name": False,
            "email": False,
            "phone": False,
            "interests": False
        }
        
        # Simple pattern matching for each type of information
        name_patterns = [r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', r'My name is ([A-Za-z ]+)', r'I\'m ([A-Za-z ]+)', r'call me ([A-Za-z ]+)']
        email_patterns = [r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b']
        phone_patterns = [r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', r'\b\+\d{1,3}[-.]?\d{3}[-.]?\d{3}[-.]?\d{4}\b']
        
        # Check for captured lead info in previous assistant messages
        for msg in conversation_history:
            content = ""
            if isinstance(msg, dict):
                content = msg.get("content", "")
            else:
                content = msg.content if hasattr(msg, "content") else ""
            
            # Check for lead info patterns in user messages
            if isinstance(msg, dict) and msg.get("role") == "user" or (hasattr(msg, "role") and msg.role == "user"):
                for pattern in name_patterns:
                    if re.search(pattern, content):
                        collected_info["name"] = True
                        break
                
                for pattern in email_patterns:
                    if re.search(pattern, content):
                        collected_info["email"] = True
                        break
                        
                for pattern in phone_patterns:
                    if re.search(pattern, content):
                        collected_info["phone"] = True
                        break
            
            # Check if "interests" is mentioned in content
            if "interest" in content.lower() or "program" in content.lower():
                collected_info["interests"] = True
            
            # Check for [LEAD_INFO] sections in assistant messages
            if isinstance(msg, dict) and msg.get("role") == "assistant" or (hasattr(msg, "role") and msg.role == "assistant"):
                pattern = r'\[LEAD_INFO\](.*?)\[\/LEAD_INFO\]'
                match = re.search(pattern, content, re.DOTALL)
                if match:
                    try:
                        lead_info_str = match.group(1)
                        lead_info = json.loads(lead_info_str)
                        if lead_info.get("name"):
                            collected_info["name"] = True
                        if lead_info.get("email"):
                            collected_info["email"] = True
                        if lead_info.get("phone"):
                            collected_info["phone"] = True
                        if lead_info.get("interests"):
                            collected_info["interests"] = True
                    except json.JSONDecodeError:
                        pass
        
        return collected_info
    
    def _create_collection_reminder(self, collected_info: Dict[str, bool]) -> str:
        """Create a reminder prompt based on what information still needs to be collected"""
        missing_info = []
        
        if not collected_info["name"]:
            missing_info.append("name (try to ask for their name naturally)")
        if not collected_info["email"]:
            missing_info.append("email address (ask when discussing updates or newsletter)")
        if not collected_info["phone"]:
            missing_info.append("phone number (ask when discussing volunteer opportunities)")
        if not collected_info["interests"]:
            missing_info.append("areas of interest (ask what programs they're most interested in)")
        
        if missing_info:
            reminder = f"""
Remember to collect the following information in your response if appropriate:
{', '.join(missing_info)}

Ask for just ONE piece of missing information in your next response, in a natural and conversational way.
"""
            return reminder
        
        return "" 