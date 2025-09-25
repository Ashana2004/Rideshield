import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theftsByLocalityData } from '../../data/mockData';

const TheftByLocalityChart = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="font-semibold text-lg mb-4">Thefts by Locality</h3>
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={theftsByLocalityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="thefts" fill="#4A90E2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TheftByLocalityChart;