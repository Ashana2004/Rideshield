import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ label, defaultValue }) => (
  <div className="relative w-full">
    <label className="text-xs text-gray-500">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-md p-2">
      <input type="text" defaultValue={defaultValue} className="w-full text-sm bg-transparent outline-none" />
      <Calendar className="w-4 h-4 text-gray-400" />
    </div>
  </div>
);

export default DatePicker;