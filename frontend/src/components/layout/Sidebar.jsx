import React from 'react';
import { Filter, MapPin, Shield, Tag, Building, Clock, Sun, Moon, RefreshCw } from 'lucide-react';
import FilterSection from '../ui/FilterSection';
import DatePicker from '../ui/DatePicker';
import TimePicker from '../ui/TimePicker';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import RadioGroup from '../ui/RadioGroup';

const Sidebar = () => {
  // Actual options from the dataset
  const policeStations = [
    "AJARA", "BHUDARGAD", "CHANDGAD", "GADHINGLAJ", "GAGAN BAWADA", 
    "GANDHINAGAR", "GOKUL SHIRGAON", "HATKANAGLE", "HUPARI", "ICHALKARANJI",
    "ISPURLI", "JAYSINGPUR", "JUNA RAJWADA", "KAGAL", "KALE", "KARVIR",
    "KODOLI", "KURUNDVAD", "LAXMIPURI", "MURGUD", "PANHALA", "RADHANAGARI",
    "RAJARAMPURI", "SHAHAPUR", "SHAHUPURI", "SHAHUWADI", "SHIROL", "SHIROLI MIDC",
    "SHIVAJINAGAR", "VADGAON"
  ];

  const categories = ["Motorcycle", "Scooter", "Other"];
  
  const makes = [
    "Hero", "Honda", "Yamaha", "TVS", "Bajaj", "Suzuki", "Royal Enfield", 
    "KTM", "Kawasaki", "Vespa", "Unknown"
  ];

  const timeOfDay = ["Morning", "Afternoon", "Evening", "Midnight"];
  
  const days = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ];

  const spotTypes = [
    "ROAD", "HOME", "NEAR TEMPLE", "PARKING", "ON ROAD", "FARM", "SHOP",
    "HOTEL", "TEMPLE", "ST STAND", "BANK", "HOSPITAL", "SCHOOL", "CHOWK",
    "COLONEY", "MARKET", "SOCIETY", "GROUND", "LOAGE", "FARM ROAD", "BLOOD BANK",
    "COMPANI", "INDASTRI", "MIDC", "ATM", "MANDIR", "COLLAGE", "COURT PARKING",
    "PUBLIC PLACE", "HAWKERS ZONE"
  ];

  // Extract unique places from the data (limited to most common for usability)
  const commonPlaces = [
    "KOLHAPUR", "ICHALKARANJI", "GADHINGLAJ", "KAGAL", "HATKANAGALE",
    "JAYSINGPUR", "SHAHAPUR", "GOKUL SHIRGAON", "AJARA", "BHUDARGAD",
    "CHANDGAD", "HUPARI", "KARVIR", "KODOLI", "PANHALA"
  ];

  return (
    <aside className="w-80 bg-white p-6 flex-shrink-0 border-r border-gray-200 shadow-sm overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center text-gray-800">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          Crime Data Filters
        </h2>
      </div>
      
      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Date Range */}
        <FilterSection title="Date Range">
          <div className="flex space-x-2">
            <DatePicker label="From" />
            <DatePicker label="To" />
          </div>
        </FilterSection>

        {/* Time Range */}
        <FilterSection title="Time Range">
          <div className="flex space-x-2 items-center">
            <TimePicker label="From" />
            <span className="text-gray-400">-</span>
            <TimePicker label="To" />
          </div>
        </FilterSection>

        {/* Police Station */}
        <FilterSection title="Police Station">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {policeStations.map(ps => (
              <Checkbox 
                key={ps} 
                label={ps} 
                icon={<Shield className="w-4 h-4 text-green-600" />} 
              />
            ))}
          </div>
        </FilterSection>

        {/* Place */}
        <FilterSection title="Place">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {commonPlaces.map(place => (
              <Checkbox 
                key={place} 
                label={place} 
                icon={<MapPin className="w-4 h-4 text-blue-500" />} 
              />
            ))}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Vehicle Category">
          <div className="space-y-2">
            {categories.map(cat => (
              <Checkbox 
                key={cat} 
                label={cat} 
                icon={<Tag className="w-4 h-4 text-purple-500" />} 
              />
            ))}
          </div>
        </FilterSection>

        {/* Make */}
        <FilterSection title="Vehicle Make">
          <Select 
            placeholder="Select Vehicle Make" 
            options={makes} 
            icon={<Building className="w-4 h-4 text-yellow-500" />} 
          />
        </FilterSection>

        {/* Spot Type */}
        <FilterSection title="Incident Location Type">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {spotTypes.map(spot => (
              <Checkbox 
                key={spot} 
                label={spot} 
                icon={<MapPin className="w-4 h-4 text-orange-500" />} 
              />
            ))}
          </div>
        </FilterSection>

        {/* Time of Day */}
        <FilterSection title="Time of Day">
          <RadioGroup 
            options={timeOfDay} 
            defaultValue="All" 
            icons={{
              "Morning": <Sun className="w-4 h-4 text-yellow-500" />,
              "Afternoon": <Sun className="w-4 h-4 text-orange-500" />,
              "Evening": <Sun className="w-4 h-4 text-red-500" />,
              "Midnight": <Moon className="w-4 h-4 text-blue-500" />
            }}
          />
        </FilterSection>

        {/* Day of Week */}
        <FilterSection title="Day of Week">
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {days.map(day => (
              <Checkbox 
                key={day} 
                label={day} 
                icon={<Clock className="w-4 h-4 text-red-500" />} 
              />
            ))}
          </div>
        </FilterSection>

        {/* Reset Button */}
        <div className="pt-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow font-medium">
            <RefreshCw className="w-4 h-4" />
            Reset All Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;  