import React from 'react';
import { FilterX } from 'lucide-react';
import FilterSection from '../ui/FilterSection';
import DatePicker from '../ui/DatePicker';
import TimePicker from '../ui/TimePicker';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import RadioGroup from '../ui/RadioGroup';

const Sidebar = () => {
  const locations = ["Shahupuri", "Rajarampuri", "Vagda Park", "Mahadwar Road", "Indumati Road"];
  const theftMethods = ["Lock Broken", "Hotwired", "Key left-in", "Lifted Away"];

  return (
    <aside className="w-72 bg-white p-6 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <FilterX className="w-5 h-5 mr-2" />
          Filters
        </h2>
      </div>
      
      <div className="space-y-6">
        <FilterSection title="Date Range">
          <div className="flex space-x-2">
            <DatePicker label="From" defaultValue="05-MAY-2021" />
            <DatePicker label="To" defaultValue="05-MAY-2021" />
          </div>
        </FilterSection>

        <FilterSection title="Time Range">
          <div className="flex space-x-2 items-center">
            <TimePicker label="From" defaultValue="00:00" />
            <span className="text-gray-400">-</span>
            <TimePicker label="To" defaultValue="23:59" />
          </div>
        </FilterSection>

        <FilterSection title="Localities">
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {locations.map(loc => <Checkbox key={loc} label={loc} />)}
          </div>
        </FilterSection>

        <FilterSection title="Bike Company & Model">
          <Select placeholder="Select Vehicle" />
        </FilterSection>

        <FilterSection title="Theft Time">
          <RadioGroup options={["All", "Day", "Night"]} defaultValue="All" />
        </FilterSection>

        <FilterSection title="Theft Methods">
          <div className="space-y-2">
            {theftMethods.map(method => <Checkbox key={method} label={method} />)}
          </div>
        </FilterSection>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Reset Filters
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;