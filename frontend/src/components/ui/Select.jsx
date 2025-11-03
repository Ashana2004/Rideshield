import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ placeholder, options = [], icon, value, onChange }) => {
  return (
    <div className="relative w-full">
      <select 
        value={value || ''}
        onChange={onChange}
        className="w-full text-sm border border-gray-300 rounded-md p-2 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

export default Select;