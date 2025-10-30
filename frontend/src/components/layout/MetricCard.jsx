import React from 'react';

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = 'text-gray-800',
  bgColor = 'bg-white',
  onClick,
  clickable = true
}) => (
  <button
    onClick={onClick}
    className={`${bgColor} p-5 rounded-lg shadow-sm flex items-start justify-between w-full transition-all duration-200 ${
      clickable 
        ? 'hover:shadow-md hover:scale-105 cursor-pointer border border-transparent hover:border-gray-200' 
        : 'cursor-default'
    }`}
    disabled={!clickable}
  >
    <div className="text-left">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
    <Icon className="w-6 h-6 text-gray-400" />
  </button>
);

export default MetricCard;