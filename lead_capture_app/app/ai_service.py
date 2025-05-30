import os
import openai
import json
import httpx
from typing import Dict, List, Optional, Union, Any
import re
import time
from openai import OpenAIError

# Function to initialize OpenAI client with API key
def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    
    # Print diagnostic info
    print(f"DIAGNOSTIC: API key prefix: {api_key[:5]}...")
    print(f"DIAGNOSTIC: API key length: {len(api_key)}")
    
    # Try with multiple configurations
    try:
        print("DIAGNOSTIC: Creating OpenAI client with standard configuration")
        return openai.OpenAI(
            api_key=api_key,
            timeout=90.0,  # Increased timeout for slow connections
            max_retries=2,  # Built-in retries
        )
    except Exception as e:
        print(f"DIAGNOSTIC: Standard client creation failed: {str(e)}")
        
        # Try with httpx configuration
        try:
            print("DIAGNOSTIC: Creating OpenAI client with custom transport")
            transport = httpx.HTTPTransport(
                verify=True,  # SSL verification
                http1=True,   # Allow HTTP/1.1
                http2=False   # Disable HTTP/2
            )
            client = httpx.Client(transport=transport)
            
            return openai.OpenAI(
                api_key=api_key,
                timeout=120.0,
                http_client=client
            )
        except Exception as inner_e:
            print(f"DIAGNOSTIC: Custom transport client creation failed: {str(inner_e)}")
            # Still return a client even with potential issues
            return openai.OpenAI(
                api_key=api_key,
                timeout=120.0
            )

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
        self.max_retries = 3  # Number of times to retry API calls
        self.retry_delay = 2  # Seconds to wait between retries
        self.openai_available = True  # Track if OpenAI is available
    
    def chat(self, user_message: str, conversation_history: List[Any] = None) -> Dict:
        """
        Process a user message and generate a response while trying to capture lead information.
        
        Args:
            user_message: The latest message from the user
            conversation_history: Previous messages in the conversation
            
        Returns:
            Dict containing the assistant's response and any captured lead information
        """
        result = self._chat_with_retry(user_message, conversation_history)
        
        # If we got a connection error response, try using the fallback system
        if "I'm having trouble connecting right now" in result["message"]:
            print("DIAGNOSTIC: Using fallback response system")
            fallback_response = self._get_fallback_response(user_message, conversation_history)
            if fallback_response:
                return fallback_response
        
        return result
    
    def _chat_with_retry(self, user_message: str, conversation_history: List[Any] = None) -> Dict:
        """Implements retry logic for API calls"""
        retries = 0
        last_error = None
        
        print("DIAGNOSTIC: Starting chat processing")
        
        while retries < self.max_retries:
            try:
                print(f"DIAGNOSTIC: Attempt {retries+1} - Starting API call")
                result = self._process_chat(user_message, conversation_history)
                print("DIAGNOSTIC: API call successful")
                return result
            except Exception as e:
                retries += 1
                last_error = str(e)
                print(f"DIAGNOSTIC: Detailed error: {str(e)}")
                print(f"DIAGNOSTIC: Error type: {type(e).__name__}")
                
                if hasattr(e, 'response') and e.response:
                    print(f"DIAGNOSTIC: Response status: {e.response.status_code}")
                    print(f"DIAGNOSTIC: Response content: {e.response.text}")
                
                if retries < self.max_retries:
                    sleep_time = self.retry_delay * (2 ** (retries - 1))
                    print(f"DIAGNOSTIC: Retrying in {sleep_time} seconds...")
                    time.sleep(sleep_time)
        
        print(f"DIAGNOSTIC: All retries failed. Last error: {last_error}")
        return {
            "message": f"I'm sorry, I'm having trouble connecting right now. Please try again later.",
            "captured_lead_info": None
        }
    
    def _process_chat(self, user_message: str, conversation_history: List[Any] = None) -> Dict:
        """Core chat processing logic"""
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
    
    def _get_fallback_response(self, user_message: str, conversation_history: List[Any] = None) -> Dict:
        """
        Generate a fallback response when OpenAI API is unavailable
        This uses pattern matching to provide basic answers to common questions
        """
        user_message = user_message.lower()
        lead_info = {}
        
        # Try to extract lead info from conversation
        if conversation_history:
            collected_info = self._analyze_conversation(conversation_history)
            # Preserve any lead info we've already collected
            if collected_info["name"]:
                lead_info["name"] = self._find_name_in_conversation(conversation_history)
            if collected_info["email"]:
                lead_info["email"] = self._find_email_in_conversation(conversation_history)
            if collected_info["phone"]:
                lead_info["phone"] = self._find_phone_in_conversation(conversation_history)
            if collected_info["interests"]:
                lead_info["interests"] = self._find_interests_in_conversation(conversation_history)
        
        # Check for name in the current message
        name_match = re.search(r'my name is ([A-Za-z ]+)', user_message, re.IGNORECASE)
        if name_match:
            lead_info["name"] = name_match.group(1)
        
        # Check for email in the current message
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', user_message)
        if email_match:
            lead_info["email"] = email_match.group(0)
        
        # Check for phone in the current message
        phone_match = re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', user_message)
        if phone_match:
            lead_info["phone"] = phone_match.group(0)
        
        # Pattern match responses based on user message
        if any(greeting in user_message for greeting in ["hello", "hi", "hey", "greetings"]):
            return {
                "message": "Hello! I'm here to tell you about Kura Cares Charity. How can I help you today?",
                "captured_lead_info": lead_info
            }
        elif any(word in user_message for word in ["program", "service", "offer"]):
            return {
                "message": "We offer several programs including Community Fitness, Whānau Hotaka (financial literacy), Future Wahine (mentorship for young women), Positive Pathways (youth mentoring), $20 Boss (entrepreneurship), and O-Beast (health support). Which of these interests you most?",
                "captured_lead_info": lead_info
            }
        elif "community fitness" in user_message:
            lead_info["interests"] = "Community Fitness Programme"
            return {
                "message": "Our Community Fitness Programme offers free seasonal boot camps in Papakura, Manurewa, and Henderson. These sessions are open to all fitness levels and are a great way to embrace Hauora through exercise. Would you like to receive updates about upcoming fitness sessions? I'd be happy to add your email to our mailing list.",
                "captured_lead_info": lead_info
            }
        elif "wahine" in user_message or "women" in user_message:
            lead_info["interests"] = "Future Wahine Programme"
            return {
                "message": "Our Future Wahine Programme supports young wahine aged 15-18 with mentorship to foster leadership, resilience, and well-being. It's made a significant impact, supporting over 40 wahine with confidence and life skills. May I ask for your name so I can provide you with more personalized information?",
                "captured_lead_info": lead_info
            }
        elif "donate" in user_message or "donation" in user_message or "support" in user_message:
            return {
                "message": "Thank you for your interest in supporting Kura Cares! Your donations help us make a real difference in our communities. Would you like to receive information about donation options? If so, could you share your email address?",
                "captured_lead_info": lead_info
            }
        elif "volunteer" in user_message or "help" in user_message or "join" in user_message:
            return {
                "message": "We appreciate your interest in volunteering with Kura Cares! Volunteers are essential to our mission. We have opportunities in various programs. For volunteer opportunities, we can keep you updated via text. Would you mind sharing your phone number?",
                "captured_lead_info": lead_info
            }
        elif "thank" in user_message:
            return {
                "message": "You're welcome! Thank you for your interest in Kura Cares Charity. We're dedicated to supporting Māori and Pacific communities in South Auckland. Is there anything else you'd like to know about our programs or how you can get involved?",
                "captured_lead_info": lead_info
            }
        else:
            # If no specific pattern matches, ask for their name if we don't have it
            if not lead_info.get("name"):
                return {
                    "message": "Thank you for your interest in Kura Cares Charity. We focus on supporting Māori and Pacific communities in South Auckland through various programs. May I know your name so I can better assist you?",
                    "captured_lead_info": lead_info
                }
            # If we have their name but not email, ask for email
            elif not lead_info.get("email"):
                return {
                    "message": f"Thank you {lead_info['name']}! Would you like to receive updates about our programs? I'd be happy to add your email to our newsletter.",
                    "captured_lead_info": lead_info
                }
            # If we have name and email but not phone, ask for phone
            elif not lead_info.get("phone"):
                return {
                    "message": f"Thank you {lead_info['name']} for your interest in Kura Cares! For volunteer opportunities, we can keep you updated via text. Would you mind sharing your phone number?",
                    "captured_lead_info": lead_info
                }
            # Fallback message if we can't determine a specific response
            else:
                return {
                    "message": "Thank you for your message. Kura Cares is dedicated to bridging economic disparities and supporting communities in South Auckland. Is there something specific about our charity you'd like to know more about?",
                    "captured_lead_info": lead_info
                }
    
    def _find_name_in_conversation(self, conversation_history):
        """Extract name from conversation history"""
        for msg in conversation_history:
            content = msg.content if hasattr(msg, "content") else msg.get("content", "")
            if msg.role if hasattr(msg, "role") else msg.get("role", "") == "user":
                name_match = re.search(r'my name is ([A-Za-z ]+)', content, re.IGNORECASE)
                if name_match:
                    return name_match.group(1)
        return None
    
    def _find_email_in_conversation(self, conversation_history):
        """Extract email from conversation history"""
        for msg in conversation_history:
            content = msg.content if hasattr(msg, "content") else msg.get("content", "")
            if msg.role if hasattr(msg, "role") else msg.get("role", "") == "user":
                email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', content)
                if email_match:
                    return email_match.group(0)
        return None
    
    def _find_phone_in_conversation(self, conversation_history):
        """Extract phone from conversation history"""
        for msg in conversation_history:
            content = msg.content if hasattr(msg, "content") else msg.get("content", "")
            if msg.role if hasattr(msg, "role") else msg.get("role", "") == "user":
                phone_match = re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', content)
                if phone_match:
                    return phone_match.group(0)
        return None
    
    def _find_interests_in_conversation(self, conversation_history):
        """Extract interests from conversation history"""
        interests = []
        keywords = {
            "Community Fitness": ["fitness", "exercise", "workout", "bootcamp"],
            "Whānau Hotaka": ["financial", "finance", "money", "budget", "hotaka"],
            "Future Wahine": ["wahine", "women", "girl", "female", "young women"],
            "Positive Pathways": ["youth", "boy", "rangatahi", "risk", "school"],
            "$20 Boss": ["entrepreneur", "business", "boss", "startup"],
            "O-Beast": ["health", "weight", "obesity", "nutrition", "gym"]
        }
        
        for msg in conversation_history:
            content = msg.content.lower() if hasattr(msg, "content") else msg.get("content", "").lower()
            for program, terms in keywords.items():
                if any(term in content for term in terms):
                    if program not in interests:
                        interests.append(program)
        
        return ", ".join(interests) if interests else None 