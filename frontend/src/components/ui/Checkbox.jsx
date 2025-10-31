import React from 'react';

const Checkbox = ({ label, icon, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
      <input 
        type="checkbox" 
        checked={checked || false}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;
