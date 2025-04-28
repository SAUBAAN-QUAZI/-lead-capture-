'use client';

import React, { useState } from 'react';

interface Program {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  startDate: string;
  endDate: string;
  leadCount: number;
  conversionRate: number;
  category: 'Education' | 'Health' | 'Community' | 'Environment' | 'Youth';
}

const ProgramsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  
  // Form state for new/edit program
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Upcoming' | 'Completed',
    startDate: '',
    endDate: '',
    category: 'Community' as 'Education' | 'Health' | 'Community' | 'Environment' | 'Youth'
  });
  
  // Mock programs data
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      name: 'Community Fitness Program',
      description: 'Weekly fitness sessions for community members of all ages, with a focus on traditional practices.',
      status: 'Active',
      startDate: '2023-01-15',
      endDate: '2023-12-31',
      leadCount: 127,
      conversionRate: 32.1,
      category: 'Health'
    },
    {
      id: 2,
      name: 'Educational Workshops',
      description: 'Monthly workshops covering various educational topics including cultural heritage and sustainability.',
      status: 'Active',
      startDate: '2023-02-10',
      endDate: '2023-11-30',
      leadCount: 98,
      conversionRate: 28.5,
      category: 'Education'
    },
    {
      id: 3,
      name: 'Environmental Initiatives',
      description: 'Projects focused on local environmental conservation and sustainability practices.',
      status: 'Active',
      startDate: '2023-03-22',
      endDate: '2023-10-15',
      leadCount: 86,
      conversionRate: 22.9,
      category: 'Environment'
    },
    {
      id: 4,
      name: 'Children Support Programs',
      description: 'After-school programs and resources designed to support childhood development and education.',
      status: 'Upcoming',
      startDate: '2023-11-01',
      endDate: '2024-06-30',
      leadCount: 73,
      conversionRate: 19.8,
      category: 'Youth'
    },
    {
      id: 5,
      name: 'Weekend Volunteering Events',
      description: 'Regular weekend events for community volunteering and social impact projects.',
      status: 'Active',
      startDate: '2023-01-05',
      endDate: '2023-12-20',
      leadCount: 71,
      conversionRate: 18.7,
      category: 'Community'
    },
  ]);
  
  // Filter programs based on search term and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchTerm === '' || 
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === 'All' || program.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || program.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Get status badge color
  const getStatusColor = (status: Program['status']) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Open edit modal with program data
  const handleEditClick = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      status: program.status,
      startDate: program.startDate,
      endDate: program.endDate,
      category: program.category
    });
    setShowAddModal(true);
  };
  
  // Open add modal with empty form
  const handleAddClick = () => {
    setEditingProgram(null);
    setFormData({
      name: '',
      description: '',
      status: 'Active' as 'Active' | 'Upcoming' | 'Completed',
      startDate: '',
      endDate: '',
      category: 'Community' as 'Education' | 'Health' | 'Community' | 'Environment' | 'Youth'
    });
    setShowAddModal(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProgram) {
      // Update existing program
      const updatedPrograms = programs.map(program => 
        program.id === editingProgram.id ? 
        { 
          ...program, 
          ...formData,
          status: formData.status,
          category: formData.category
        } : program
      );
      setPrograms(updatedPrograms);
    } else {
      // Add new program
      const newProgram: Program = {
        id: Math.max(...programs.map(p => p.id)) + 1,
        ...formData,
        leadCount: 0,
        conversionRate: 0
      };
      setPrograms([...programs, newProgram]);
    }
    
    setShowAddModal(false);
  };
  
  // Handle program deletion
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter(program => program.id !== id));
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <button 
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Program
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Community">Community</option>
              <option value="Environment">Environment</option>
              <option value="Youth">Youth</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Programs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditClick(program)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(program.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{program.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div>Start Date:</div>
                <div className="font-medium">{program.startDate}</div>
                
                <div>End Date:</div>
                <div className="font-medium">{program.endDate}</div>
                
                <div>Category:</div>
                <div className="font-medium">{program.category}</div>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-gray-500">Lead Count</div>
                  <div className="font-semibold">{program.leadCount}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">Conversion Rate</div>
                  <div className="font-semibold">{program.conversionRate}%</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add/Edit Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-semibold">{editingProgram ? 'Edit Program' : 'Add New Program'}</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Community">Community</option>
                    <option value="Environment">Environment</option>
                    <option value="Youth">Youth</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 rounded-md text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingProgram ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsPage; 