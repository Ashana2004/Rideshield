import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Select = ({ placeholder }) => (
  <div className="relative w-full">
    <select className="w-full text-sm border border-gray-300 rounded-md p-2 appearance-none bg-white">
      <option>{placeholder}</option>
    </select>
    <ChevronLeft className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 transform rotate-[-90deg]" />
  </div>
);

export default Select;