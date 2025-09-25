import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theftsByCompanyData, COLORS } from '../../data/mockData';

const TheftByCompanyChart = () => {
  const [activeTab, setActiveTab] = useState('compare');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Thefts By Company</h3>
      <div className="mb-4">
        <div className="flex border-b">
          <button 
            className={`py-2 px-4 text-sm font-medium rounded-t-md ${
              activeTab === 'compare' 
                ? 'text-white bg-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('compare')}
          >
            Compare
          </button>
          <button 
            className={`py-2 px-4 text-sm font-medium rounded-t-md ${
              activeTab === 'daynight' 
                ? 'text-white bg-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('daynight')}
          >
            Day/Night
          </button>
          <button 
            className={`py-2 px-4 text-sm font-medium rounded-t-md ${
              activeTab === 'method' 
                ? 'text-white bg-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('method')}
          >
            Method
          </button>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie 
              data={theftsByCompanyData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label
            >
              {theftsByCompanyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TheftByCompanyChart;