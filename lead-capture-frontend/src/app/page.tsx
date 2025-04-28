'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import for the chat container to avoid hydration issues
const ChatContainer = dynamic(() => import('./components/ChatContainer'), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading chat...</p>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-blue-700">Charity Foundation</h1>
          <p className="text-sm text-gray-600">Making a difference together</p>
        </div>
        <div className="container mx-auto text-right mt-1">
          <Link 
            href="/dashboard" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Admin Dashboard →
          </Link>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 lg:w-3/5 flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Our charity foundation is dedicated to creating positive change in communities around the world.
              We focus on education, healthcare, environmental sustainability, and humanitarian aid.
            </p>
            <p className="text-gray-700">
              With your support, we can continue to make a difference in the lives of those who need it most.
              Learn more about our programs and how you can get involved by chatting with our assistant.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Get Involved</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Volunteer your time and skills</li>
              <li>Make a donation to support our programs</li>
              <li>Participate in fundraising events</li>
              <li>Spread awareness about our cause</li>
              <li>Partner with us for community initiatives</li>
            </ul>
          </div>
        </div>
        
        <div className="md:w-1/2 lg:w-2/5 h-[600px] md:h-auto">
          <ChatContainer />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} Charity Foundation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
