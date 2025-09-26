import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TheftTrendsChart = () => {
  const [theftTrends, setTheftTrends] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/theft-trends")
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => setTheftTrends(data.data || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Theft Trends Over Time</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <LineChart
            data={theftTrends}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="thefts"
              stroke="#50E3C2"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TheftTrendsChart;
