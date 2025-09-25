import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theftTrendsData } from '../../data/mockData';

const TheftTrendsChart = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="font-semibold text-lg mb-4">Theft Trends Over Time</h3>
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={theftTrendsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]}/>
          <Tooltip />
          <Line type="monotone" dataKey="thefts" stroke="#50E3C2" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TheftTrendsChart;