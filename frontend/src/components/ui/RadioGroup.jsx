import React from 'react';

const RadioGroup = ({ options, value, onChange, icons = {} }) => {
  return (
    <div className="space-y-3">
      {/* "All" option */}
      <label className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
        <input 
          type="radio" 
          name="filter-radio-group"
          checked={value === "All" || !value}
          onChange={() => onChange("All")}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-gray-700 font-medium">All</span>
      </label>
      
      {/* Dynamic options */}
      {options.map(option => (
        <label key={option} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
          <input 
            type="radio" 
            name="filter-radio-group"
            checked={value === option}
            onChange={() => onChange(option)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          {icons[option] && <span className="flex-shrink-0">{icons[option]}</span>}
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;