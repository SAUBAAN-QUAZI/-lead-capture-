'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  change: number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, count, change, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-gray-600 text-sm">{title}</h3>
          <p className="text-4xl font-bold">{count}</p>
        </div>
      </div>
      <div className="text-sm flex items-center">
        <span className={`${change >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
};

// Lead Item Component
interface LeadItemProps {
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
}

const LeadItem: React.FC<LeadItemProps> = ({ name, lastMessage, time, avatar }) => {
  return (
    <div className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center">
        <div className="w-10 h-10 flex-shrink-0 mr-3">
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
            <span className="text-sm font-semibold">{avatar}</span>
          </div>
        </div>
        <div className="flex-grow">
          <h4 className="text-sm font-medium">{name}</h4>
          <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
        </div>
        <div className="text-xs text-gray-400">{time}</div>
      </div>
    </div>
  );
};

// Tab Component
interface TabProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`flex items-center p-3 border-b-2 ${active ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

// Main Dashboard Page
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('facebook');

  // Facebook icon
  const FacebookIcon = () => (
    <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  // Instagram icon
  const InstagramIcon = () => (
    <svg className="h-6 w-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );

  // WhatsApp icon
  const WhatsAppIcon = () => (
    <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  // Program icon
  const ProgramIcon = () => (
    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          icon={<FacebookIcon />} 
          title="Facebook Leads" 
          count={142} 
          change={12} 
          color="bg-blue-100" 
        />
        <StatsCard 
          icon={<InstagramIcon />} 
          title="Instagram Leads" 
          count={98} 
          change={8} 
          color="bg-pink-100" 
        />
        <StatsCard 
          icon={<WhatsAppIcon />} 
          title="WhatsApp Engagements" 
          count={215} 
          change={18} 
          color="bg-green-100" 
        />
      </div>
      
      {/* Tabs and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Tabs */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="flex border-b overflow-x-auto">
              <Tab 
                icon={<FacebookIcon />} 
                label="Facebook Messenger" 
                active={activeTab === 'facebook'} 
                onClick={() => setActiveTab('facebook')} 
              />
              <Tab 
                icon={<InstagramIcon />} 
                label="Instagram DM" 
                active={activeTab === 'instagram'} 
                onClick={() => setActiveTab('instagram')} 
              />
            </div>
            
            <div className="overflow-y-auto max-h-[500px]">
              <div className="p-4 border-b">
                <h3 className="font-medium">Facebook Leads</h3>
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Search leads..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Lead List */}
              <div>
                <LeadItem 
                  name="Jessica Thompson" 
                  lastMessage="I'm interested in the fitness program" 
                  time="10 min ago" 
                  avatar="JT" 
                />
                <LeadItem 
                  name="Mark Johnson" 
                  lastMessage="Yes, my ethnicity is Pacific Islander" 
                  time="35 min ago" 
                  avatar="MJ" 
                />
                <LeadItem 
                  name="Sarah Wilson" 
                  lastMessage="I'm 28 years old" 
                  time="2 hours ago" 
                  avatar="SW" 
                />
                <LeadItem 
                  name="David Lee" 
                  lastMessage="I'd like to volunteer for the weekend event" 
                  time="5 hours ago" 
                  avatar="DL" 
                />
                <LeadItem 
                  name="Maria Rodriguez" 
                  lastMessage="My email is maria@example.com" 
                  time="6 hours ago" 
                  avatar="MR" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat View */}
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            {/* Chat Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                  <span className="text-sm font-semibold">JT</span>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Jessica Thompson</h3>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-500 ml-1">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 px-3 py-1 text-xs text-blue-700 mr-3">
                  <span>Program: Community Fitness</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-600 mr-2">AI Mode:</span>
                  <div className="relative">
                    <input type="checkbox" id="ai-toggle" className="sr-only" defaultChecked />
                    <label htmlFor="ai-toggle" className="block w-10 h-6 rounded-full bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out">
                      <span className="block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow transform duration-200 ease-in-out translate-x-4"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Bot Message */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hi Jessica! I'm the AI assistant for our charity organization. I'd like to ask you a few questions to help you get started with our programs. What's your age?</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:15 AM</span>
                </div>
              </div>
              
              {/* User Message */}
              <div className="flex items-start justify-end">
                <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">I'm 32 years old.</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:16 AM</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-2">
                  <span className="text-xs font-semibold">JT</span>
                </div>
              </div>
              
              {/* Bot Message */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Thank you! May I ask about your ethnicity? This helps us tailor our programs to best serve our diverse community.</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:16 AM</span>
                </div>
              </div>
              
              {/* User Message */}
              <div className="flex items-start justify-end">
                <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">I'm Māori.</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:17 AM</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-2">
                  <span className="text-xs font-semibold">JT</span>
                </div>
              </div>
            </div>
            
            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 