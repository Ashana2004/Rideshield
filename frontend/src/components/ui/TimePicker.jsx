import React from 'react';
import { Clock } from 'lucide-react';

const TimePicker = ({ label, defaultValue }) => (
  <div className="relative w-full">
    <label className="text-xs text-gray-500">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-md p-2">
      <input type="text" defaultValue={defaultValue} className="w-full text-sm bg-transparent outline-none" />
      <Clock className="w-4 h-4 text-gray-400" />
    </div>
  </div>
);

export default TimePicker;