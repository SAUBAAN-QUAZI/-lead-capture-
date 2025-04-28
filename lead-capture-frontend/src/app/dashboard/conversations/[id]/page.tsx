'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  interests: string;
  status: 'New' | 'Active' | 'Contacted' | 'Qualified' | 'Converted';
  platform: 'Website' | 'Facebook' | 'Instagram' | 'WhatsApp';
  createdAt: string;
  lastActivity: string;
  notes: string;
}

const ConversationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id;
  
  const [newMessage, setNewMessage] = useState('');
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('chat');
  const [aiMode, setAiMode] = useState<boolean>(true);
  
  // Mock conversation data
  const lead: Lead = {
    id: Number(leadId),
    name: 'Jessica Thompson',
    email: 'jessica@example.com',
    phone: '+1234567890',
    interests: 'Community Fitness Program, Education Outreach',
    status: 'Active',
    platform: 'Website',
    createdAt: '2023-10-15 14:23',
    lastActivity: '10 minutes ago',
    notes: 'Jessica is interested in volunteering for our weekend events and has experience with community outreach programs.',
  };
  
  // Mock conversation messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      content: 'Hi Jessica! I\'m the AI assistant for our charity foundation. I\'d like to ask you a few questions to help you get started with our programs. What\'s your age?',
      timestamp: '10:15 AM'
    },
    {
      id: 2,
      role: 'user',
      content: 'I\'m 32 years old.',
      timestamp: '10:16 AM'
    },
    {
      id: 3,
      role: 'bot',
      content: 'Thank you! May I ask about your ethnicity? This helps us tailor our programs to best serve our diverse community.',
      timestamp: '10:16 AM'
    },
    {
      id: 4,
      role: 'user',
      content: 'I\'m Māori.',
      timestamp: '10:17 AM'
    },
    {
      id: 5,
      role: 'bot',
      content: 'Great! We have several programs that support and celebrate Māori culture. Are you interested in our fitness program, educational workshops, or community events?',
      timestamp: '10:17 AM'
    },
    {
      id: 6,
      role: 'user',
      content: 'I\'m interested in the fitness program and maybe some educational workshops.',
      timestamp: '10:18 AM'
    },
    {
      id: 7,
      role: 'bot',
      content: 'Excellent choices! Our Community Fitness Program meets twice a week and includes traditional movement practices. The Educational Workshops cover various topics including cultural heritage and sustainability. Could you provide an email address so we can send you more information?',
      timestamp: '10:18 AM'
    },
    {
      id: 8,
      role: 'user',
      content: 'Sure, it\'s jessica@example.com',
      timestamp: '10:19 AM'
    },
    {
      id: 9,
      role: 'bot',
      content: 'Thank you, Jessica! I\'ve recorded your email. One last question - do you have a phone number we can use to send you reminders about upcoming events?',
      timestamp: '10:19 AM'
    },
    {
      id: 10,
      role: 'user',
      content: 'Yes, my number is +1234567890',
      timestamp: '10:20 AM'
    },
    {
      id: 11,
      role: 'bot',
      content: 'Perfect! I\'ve added all your information to our system. You\'ll receive an email shortly with details about our Community Fitness Program and upcoming Educational Workshops. Is there anything specific you\'d like to know about these programs?',
      timestamp: '10:20 AM'
    },
  ]);
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        role: 'bot',
        content: `Thank you for your message. Our team will get back to you soon regarding "${newMessage}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In a real app, you'd call an API to update the lead's notes
    // For now, we just update the local state
    lead.notes = `${lead.notes}\n\n${new Date().toLocaleDateString()}: ${newNote}`;
    setNewNote('');
  };
  
  // Get status badge color
  const getStatusColor = (status: Lead['status']) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-purple-100 text-purple-800';
      case 'Converted': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get platform icon
  const getPlatformIcon = (platform: Lead['platform']) => {
    switch(platform) {
      case 'Facebook':
        return (
          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'Instagram':
        return (
          <svg className="h-4 w-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        );
      case 'WhatsApp':
        return (
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            Conversation with {lead.name}
            <span className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          </h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <span className="text-sm text-gray-600 mr-2">AI Mode:</span>
            <div className="relative">
              <input 
                type="checkbox" 
                id="ai-toggle" 
                className="sr-only" 
                checked={aiMode} 
                onChange={() => setAiMode(!aiMode)} 
              />
              <label 
                htmlFor="ai-toggle" 
                className={`block w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${aiMode ? 'bg-blue-500' : 'bg-gray-200'}`}
              >
                <span 
                  className={`block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow transform duration-200 ease-in-out ${aiMode ? 'translate-x-4' : 'translate-x-0'}`}
                />
              </label>
            </div>
          </div>
          <div className="flex">
            <button 
              className="px-3 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
            >
              Update Status
            </button>
            <button 
              className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-t-lg shadow-sm border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('info')}
          >
            Lead Information
          </button>
        </div>
      </div>
      
      {/* Chat or Info content */}
      {activeTab === 'chat' ? (
        <div className="bg-white rounded-b-lg shadow">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                <div className={`rounded-lg p-3 max-w-[80%] ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-2">
                    <span className="text-xs font-semibold">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-b-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lead Details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">Name:</span>
                  <span className="col-span-2 font-medium">{lead.name}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="col-span-2 font-medium">{lead.email}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="col-span-2 font-medium">{lead.phone}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">Interests:</span>
                  <span className="col-span-2 font-medium">{lead.interests}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">Platform:</span>
                  <span className="col-span-2 font-medium flex items-center">
                    {getPlatformIcon(lead.platform)}
                    <span className="ml-1">{lead.platform}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="col-span-2 font-medium">{lead.createdAt}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">Last Activity:</span>
                  <span className="col-span-2 font-medium">{lead.lastActivity}</span>
                </div>
              </div>
              
              {/* Status Update */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Status</h3>
                <select
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={lead.status}
                  onChange={() => {}}
                >
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                </select>
                <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm font-medium">
                  Update Status
                </button>
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <h3 className="text-lg font-medium mb-4">Notes</h3>
              <div className="border rounded-lg p-3 mb-4 h-40 overflow-y-auto bg-gray-50 whitespace-pre-line text-sm">
                {lead.notes || 'No notes added yet.'}
              </div>
              <textarea
                rows={3}
                placeholder="Add a new note..."
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
              <button
                className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm font-medium"
                onClick={handleAddNote}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetailPage; 