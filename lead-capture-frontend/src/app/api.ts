// API utilities for communicating with the backend

// Define possible API endpoints
const API_ENDPOINTS = {
  local: 'http://localhost:8000',
  production: 'https://lead-capture-9mnb.onrender.com'
};

// Smart API URL selection with fallback
function getApiBaseUrl() {
  // Priority 1: Environment variable (set in deployment)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Priority 2: Development vs Production detection
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  return isLocalhost ? API_ENDPOINTS.local : API_ENDPOINTS.production;
}

// This API URL is determined at runtime
const API_URL = getApiBaseUrl();

// Track backend availability
let isProductionBackendAvailable = true;
let isLocalBackendAvailable = true;

// Types matching the backend schemas
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LeadInfo {
  name?: string;
  email?: string;
  phone?: string;
  interests?: string;
}

export interface ChatRequest {
  message: string;
  conversation_history: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  captured_lead_info: LeadInfo | null;
}

// Check if a backend is available by pinging it
async function checkBackendHealth(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${url}/`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn(`Backend at ${url} is not available:`, error);
    return false;
  }
}

// Try to send a request, falling back to the alternate backend if needed
async function safeFetch(path: string, options: RequestInit): Promise<Response> {
  const primaryUrl = API_URL;
  const secondaryUrl = primaryUrl === API_ENDPOINTS.local ? API_ENDPOINTS.production : API_ENDPOINTS.local;
  
  try {
    // Try primary backend first
    const response = await fetch(`${primaryUrl}${path}`, options);
    return response;
  } catch (error) {
    console.warn(`Primary backend request failed, trying secondary:`, error);
    
    // Before trying secondary, verify it's available
    const isSecondaryAvailable = await checkBackendHealth(secondaryUrl);
    if (!isSecondaryAvailable) {
      throw new Error("All backends are unavailable");
    }
    
    // Try secondary backend
    return fetch(`${secondaryUrl}${path}`, options);
  }
}

// Send a message to the chat API
export async function sendChatMessage(message: string, conversationHistory: ChatMessage[]): Promise<ChatResponse> {
  try {
    const response = await safeFetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      } as ChatRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Chat error:", error);
    // Return a graceful error that matches our response type
    return {
      message: "I'm having trouble connecting right now. Please try again in a moment.",
      captured_lead_info: null
    };
  }
}

// Get all leads
export async function getLeads() {
  try {
    const response = await safeFetch('/leads', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch leads: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Leads fetch error:", error);
    return [];
  }
} 