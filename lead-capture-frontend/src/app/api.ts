// API utilities for communicating with the backend

// Backend API URL - can be overridden by environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lead-capture-9mnb.onrender.com';

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

// Send a message to the chat API
export async function sendChatMessage(message: string, conversationHistory: ChatMessage[]): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
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
}

// Get all leads
export async function getLeads() {
  const response = await fetch(`${API_URL}/leads`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch leads: ${response.status}`);
  }
  
  return await response.json();
} 