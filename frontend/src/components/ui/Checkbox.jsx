import React from 'react';

const Checkbox = ({ label }) => (
  <label className="flex items-center space-x-2 text-sm">
    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
    <span>{label}</span>
  </label>
);

export default Checkbox;