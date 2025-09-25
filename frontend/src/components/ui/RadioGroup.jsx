import React from 'react';

const RadioGroup = ({ options, defaultValue }) => (
  <div className="flex space-x-4">
    {options.map(option => (
      <label key={option} className="flex items-center space-x-2 text-sm">
        <input 
          type="radio" 
          name="theft-time" 
          value={option} 
          defaultChecked={option === defaultValue} 
          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <span>{option}</span>
      </label>
    ))}
  </div>
);

export default RadioGroup;