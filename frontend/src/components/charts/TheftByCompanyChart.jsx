import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
 

const TheftByCompanyChart = ({ filters }) => {
  const [companyTimeData, setCompanyTimeData] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [activeTab, setActiveTab] = useState('compare');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E74C3C'];

  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (filters.localities && filters.localities.length > 0) {
      params.append('localities', filters.localities.join(','));
    }
    if (filters.places && filters.places.length > 0) {
      params.append('places', filters.places.join(','));
    }
    if (filters.company) {
      params.append('company', filters.company);
    }
    if (filters.categories && filters.categories.length > 0) {
      params.append('categories', filters.categories.join(','));
    }
    if (filters.timeOfDay && filters.timeOfDay !== "All") {
      params.append('time_of_day', filters.timeOfDay);
    }
    if (filters.days && filters.days.length > 0) {
      params.append('days', filters.days.join(','));
    }
    if (filters.spotTypes && filters.spotTypes.length > 0) {
      params.append('spot_types', filters.spotTypes.join(','));
    }
    
    return params.toString();
  };

  useEffect(() => {
    const queryString = buildQueryString();
    const time_slots = ["Morning", "Afternoon", "Evening", "Midnight"];

    // First API: model/time-slot data
    fetch(`http://127.0.0.1:8000/api/Time_slot-by-company?${queryString}`)
      .then(res => res.json())
      .then(data => {
        // Create combined data for pie chart
        const dayNightTotals = time_slots.map(slot => ({
          name: slot,
          value: data.data.reduce((sum, company) => sum + (company[slot] || 0), 0),
        }));

        // Second API: company theft totals
        fetch(`http://127.0.0.1:8000/api/thefts-company?${queryString}`)
          .then(res => res.json())
          .then(companyData => {
            const companyTotals = companyData.data.map(item => ({
              name: item.company,
              value: item.count 
            }));

            setCompanyTimeData(dayNightTotals);
            setCompareData(companyTotals);
          })
          .catch(err => console.error("Error fetching theft-company:", err));
      })
      .catch(err => console.error("Error fetching time-slot-by-company:", err));
  }, [filters]); // Re-fetch when filters change

  const chartData = activeTab === "daynight" ? companyTimeData : compareData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Thefts By Company</h3>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex border-b">
          {["compare", "daynight"].map(tab => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium rounded-t-md ${
                activeTab === tab
                  ? "text-white bg-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "compare" ? "By Company" : "By Time of Day"}
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