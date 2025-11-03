import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ label, value, onChange }) => {
  return (
    <div className="relative w-full">
      <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <input 
          type="date" 
          value={value || ''}
          onChange={onChange}
          className="w-full text-sm bg-transparent outline-none"
        />
        <Calendar className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
      </div>
    </div>
  );
};

export default DatePicker;