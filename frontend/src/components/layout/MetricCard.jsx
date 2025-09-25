import React from 'react';

const MetricCard = ({ icon: Icon, title, value, subtitle, color = 'text-gray-800' }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
    <Icon className="w-6 h-6 text-gray-400" />
  </div>
);

export default MetricCard;