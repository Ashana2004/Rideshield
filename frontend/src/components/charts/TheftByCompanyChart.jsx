import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '../../data/mockData';

const TheftByCompanyChart = () => {
  const [dayNightByCompany, setDayNightByCompany] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [activeTab, setActiveTab] = useState('compare');

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/day-night-by-company")
      .then(res => res.json())
      .then(data => {
        const daynight = [
          { name: "Day", value: data.data.reduce((sum, item) => sum + item.Day, 0) },
          { name: "Night", value: data.data.reduce((sum, item) => sum + item.Night, 0) }
        ];
        const compare = data.data.map(item => ({
          name: item.company,
          value: item.Day + item.Night
        }));

        setDayNightByCompany(daynight);
        setCompareData(compare);
      })
      .catch(err => console.error(err));
  }, []);

  const chartData = activeTab === "daynight" ? dayNightByCompany : compareData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Thefts By Company</h3>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex border-b">
          {["compare", "daynight", "method"].map(tab => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium rounded-t-md ${
                activeTab === tab
                  ? "text-white bg-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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
