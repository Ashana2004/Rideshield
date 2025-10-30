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
    "GANDHINAGAR", "GOKUL SHIRGAON", "HATKANAGALE", "HUPARI", "ICHALKARANJI",
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

  const handleResetFilters = () => {
    // Add logic to reset all filters
    console.log("Resetting all filters");
    // You can implement filter reset logic here
  };

  return (
    <aside className="w-80 h-screen bg-white flex flex-col border-r border-gray-200">
      {/* Sticky Header - Fixed at top */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            Crime Data Filters
          </h2>
        </div>
      </div>
      
      {/* Scrollable Filter Content - Takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-4">
          {/* Date Range */}
          <FilterSection title="Date Range">
            <div className="flex space-x-2">
              <div className="flex-1">
                <DatePicker label="From" />
              </div>
              <div className="flex-1">
                <DatePicker label="To" />
              </div>
            </div>
          </FilterSection>

          {/* Time Range */}
          <FilterSection title="Time Range">
            <div className="flex space-x-2 items-center">
              <div className="flex-1">
                <TimePicker label="From" />
              </div>
              <span className="text-gray-400 text-sm">to</span>
              <div className="flex-1">
                <TimePicker label="To" />
              </div>
            </div>
          </FilterSection>

          {/* Police Station */}
          <FilterSection title="Police Station">
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {policeStations.map(ps => (
                <div key={ps} className="flex items-center space-x-3">
                  <Checkbox 
                    label={ps} 
                    icon={<Shield className="w-4 h-4 text-green-600" />} 
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Place */}
          <FilterSection title="Place">
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {commonPlaces.map(place => (
                <div key={place} className="flex items-center space-x-3">
                  <Checkbox 
                    label={place} 
                    icon={<MapPin className="w-4 h-4 text-blue-500" />} 
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Category */}
          <FilterSection title="Vehicle Category">
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat} className="flex items-center space-x-3">
                  <Checkbox 
                    label={cat} 
                    icon={<Tag className="w-4 h-4 text-purple-500" />} 
                  />
                </div>
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
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {spotTypes.map(spot => (
                <div key={spot} className="flex items-center space-x-3">
                  <Checkbox 
                    label={spot} 
                    icon={<MapPin className="w-4 h-4 text-orange-500" />} 
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Time of Day */}
          <FilterSection title="Time of Day">
            <div className="space-y-3">
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
            </div>
          </FilterSection>

          {/* Day of Week */}
          <FilterSection title="Day of Week">
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {days.map(day => (
                <div key={day} className="flex items-center space-x-3">
                  <Checkbox 
                    label={day} 
                    icon={<Clock className="w-4 h-4 text-red-500" />} 
                  />
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Sticky Footer with Reset Button - Fixed at bottom */}
      <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
        <button 
          onClick={handleResetFilters}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Reset All Filters
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;