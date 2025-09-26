import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const TheftByLocalityChart = () => {
  const [theftsByLocalityData, setTheftsByLocality] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/thefts-by-locality")
      .then(res => res.json())
      .then(data => setTheftsByLocality(data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Thefts by Locality</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <BarChart
            data={theftsByLocalityData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="locality" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TheftByLocalityChart;
