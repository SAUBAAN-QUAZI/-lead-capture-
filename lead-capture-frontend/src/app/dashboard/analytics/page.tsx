'use client';

import React from 'react';

// Mock chart component since we don't want to install chart libraries for this example
const Chart = ({ title, description, color }: { title: string; description: string; color: string }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className={`h-40 ${color} rounded-lg flex items-center justify-center`}>
        <span className="text-white font-medium">Chart Placeholder</span>
      </div>
    </div>
  );
};

// Mock stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeLabel, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-100">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} font-medium`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">{changeLabel}</span>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  // Icons for stat cards
  const UserIcon = () => (
    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
  
  const ConversionIcon = () => (
    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  const MessageIcon = () => (
    <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
  
  const RetentionIcon = () => (
    <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-md text-sm py-1 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Year to date</option>
          </select>
          <button className="bg-white border border-gray-300 rounded-md text-sm py-1 px-3 text-gray-700 hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Leads" 
          value="455" 
          change={12.8} 
          changeLabel="from last month" 
          icon={<UserIcon />} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="24.3%" 
          change={3.6} 
          changeLabel="from last month" 
          icon={<ConversionIcon />} 
        />
        <StatCard 
          title="Avg. Messages" 
          value="8.5" 
          change={-1.3} 
          changeLabel="from last month" 
          icon={<MessageIcon />} 
        />
        <StatCard 
          title="Follow-up Rate" 
          value="72.1%" 
          change={8.7} 
          changeLabel="from last month" 
          icon={<RetentionIcon />} 
        />
      </div>
      
      {/* Charts - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart 
          title="Lead Acquisition" 
          description="Number of leads captured over time" 
          color="bg-blue-500" 
        />
        <Chart 
          title="Conversion Funnel" 
          description="Lead progression through stages" 
          color="bg-green-500" 
        />
      </div>
      
      {/* Charts - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Chart 
          title="Lead Sources" 
          description="Distribution of lead acquisition channels" 
          color="bg-purple-500" 
        />
        <Chart 
          title="Engagement Metrics" 
          description="Message count and response time" 
          color="bg-indigo-500" 
        />
        <Chart 
          title="Geographical Distribution" 
          description="Lead distribution by location" 
          color="bg-pink-500" 
        />
      </div>
      
      {/* Top Performing Programs */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Top Performing Programs</h3>
          <p className="text-sm text-gray-500">Programs with highest lead interest and conversion</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Engagement</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">Community Fitness Program</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">127</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">32.1%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">9.3 messages</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-green-500 font-medium">↑ 14.2%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">Educational Workshops</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">98</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">28.5%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">7.8 messages</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-green-500 font-medium">↑ 8.7%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">Environmental Initiatives</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">86</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">22.9%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">6.5 messages</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-red-500 font-medium">↓ 2.1%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">Children Support Programs</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">73</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">19.8%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">5.2 messages</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-green-500 font-medium">↑ 11.3%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">Weekend Volunteering Events</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">71</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">18.7%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">4.9 messages</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-green-500 font-medium">↑ 6.8%</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 