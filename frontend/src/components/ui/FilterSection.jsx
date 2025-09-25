import React from 'react';

const FilterSection = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-600 mb-3">{title}</h3>
    {children}
  </div>
);

export default FilterSection;