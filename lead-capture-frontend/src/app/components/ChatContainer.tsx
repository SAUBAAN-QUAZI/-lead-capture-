import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType, sendChatMessage, LeadInfo } from '../api';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m here to tell you about our charity foundation. How can I help you today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessageType = {
      role: 'user',
      content: message,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call API
      const response = await sendChatMessage(message, conversationHistory);
      
      // Add assistant response to chat
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: response.message,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update captured lead info if available
      if (response.captured_lead_info) {
        setLeadInfo(current => ({
          ...current,
          ...response.captured_lead_info
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message
      const errorMessage: ChatMessageType = {
        role: 'assistant',
        content: 'Sorry, I had trouble responding. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Charity header */}
      <div className="bg-blue-600 text-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold">Charity Foundation Assistant</h1>
        <p className="text-sm opacity-80">Ask me about our programs, volunteering, or donations</p>
      </div>
      
      {/* Lead info banner - only show if we have captured info */}
      {leadInfo && Object.values(leadInfo).some(v => v) && (
        <div className="bg-green-50 border-b border-green-200 p-3">
          <h3 className="text-sm font-medium text-green-800">Thanks for your information</h3>
          <div className="text-xs text-green-700 mt-1">
            {leadInfo.name && <p>Name: {leadInfo.name}</p>}
            {leadInfo.email && <p>Email: {leadInfo.email}</p>}
            {leadInfo.phone && <p>Phone: {leadInfo.phone}</p>}
            {leadInfo.interests && <p>Interests: {leadInfo.interests}</p>}
          </div>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center mt-2">
            <div className="dot-typing"></div>
          </div>
        )}
      </div>
      
      {/* Message input */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatContainer; 