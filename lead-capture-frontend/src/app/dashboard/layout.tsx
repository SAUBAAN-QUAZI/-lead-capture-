'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(3);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              <Link href="/dashboard">Charity<span className="text-gray-800">AI</span></Link>
            </h1>
            
            <Link 
              href="/" 
              className="ml-4 text-sm text-gray-600 hover:text-blue-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Chat
            </Link>
            
            <nav className="ml-12 hidden md:flex">
              <Link 
                href="/dashboard" 
                className={`px-4 py-2 mx-1 ${isActive('/dashboard') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/conversations" 
                className={`px-4 py-2 mx-1 ${isActive('/dashboard/conversations') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Conversations
              </Link>
              <Link 
                href="/dashboard/programs" 
                className={`px-4 py-2 mx-1 ${isActive('/dashboard/programs') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Programs
              </Link>
              <Link 
                href="/dashboard/analytics" 
                className={`px-4 py-2 mx-1 ${isActive('/dashboard/analytics') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Analytics
              </Link>
              <Link 
                href="/dashboard/settings" 
                className={`px-4 py-2 mx-1 ${isActive('/dashboard/settings') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            <button className="relative p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                <span className="text-sm font-semibold">A</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 