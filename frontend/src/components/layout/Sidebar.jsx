import React, { useState } from 'react';
import { Filter, MapPin, Shield, Tag, Building, Clock, Sun, Moon, RefreshCw } from 'lucide-react';
import FilterSection from '../ui/FilterSection';
import DatePicker from '../ui/DatePicker';
import TimePicker from '../ui/TimePicker';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import RadioGroup from '../ui/RadioGroup';

const Sidebar = ({ filters = {}, setFilters }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Provide default values if filters is undefined or missing properties
  const safeFilters = {
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: "",
    localities: [],
    places: [],
    company: "",
    categories: [],
    timeOfDay: "All",
    days: [],
    spotTypes: [],
    ...filters
  };

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

  const commonPlaces = [
    "KOLHAPUR", "ICHALKARANJI", "GADHINGLAJ", "KAGAL", "HATKANAGALE",
    "JAYSINGPUR", "SHAHAPUR", "GOKUL SHIRGAON", "AJARA", "BHUDARGAD",
    "CHANDGAD", "HUPARI", "KARVIR", "KODOLI", "PANHALA"
  ];

  const handleCheckboxChange = (filterKey, value) => {
    if (!setFilters) return;
    setFilters(prev => {
      const currentValues = prev[filterKey] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterKey]: newValues };
    });
  };

  const handleSelectChange = (filterKey, value) => {
    if (!setFilters) return;
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleRadioChange = (filterKey, value) => {
    if (!setFilters) return;
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleResetFilters = () => {
    if (!setFilters) return;
    setFilters({
      dateFrom: "",
      dateTo: "",
      timeFrom: "",
      timeTo: "",
      localities: [],
      places: [],
      company: "",
      categories: [],
      timeOfDay: "All",
      days: [],
      spotTypes: []
    });
  };

  const renderListWithToggle = ({ items, keyName, iconComponent = null, filterKey }) => {
    const showAll = !!expanded[keyName];
    const visible = showAll ? items : items.slice(0, 5);
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-1 text-sm">
          {visible.map(item => (
            <Checkbox
              key={item}
              label={item}
              icon={iconComponent}
              checked={safeFilters[filterKey]?.includes(item)}
              onChange={() => handleCheckboxChange(filterKey, item)}
            />
          ))}
        </div>
 
        {items.length > 5 && (
          <div className="pt-1">
            <button
              onClick={() => toggleExpanded(keyName)}
              className="text-xs text-blue-600 hover:underline"
              aria-expanded={showAll}
            >
              {showAll ? 'Show less' : `+ ${items.length - 5} more`}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
   <aside className="w-96 lg:w-80 h-screen bg-white flex flex-col border-r border-gray-200 shadow-sm">
       
     {/* add `no-scrollbar` here */}
     <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar">
       <FilterSection title="Date Range">
         <div className="grid grid-cols-1 gap-2">
           <DatePicker 
             label="From"
             value={safeFilters.dateFrom}
             onChange={(e) => handleSelectChange('dateFrom', e.target.value)}
             className="w-full"
           /> 
           <DatePicker 
             label="To"
             value={safeFilters.dateTo}
             onChange={(e) => handleSelectChange('dateTo', e.target.value)}
             className="w-full"
           />
         </div>
       </FilterSection>

       

       <FilterSection title="Police Station">
         <div className="text-sm max-h-56 overflow-y-auto pr-1">
           {renderListWithToggle({ items: policeStations, keyName: 'policeStations', iconComponent: <Shield className="w-4 h-4 text-green-600" />, filterKey: 'localities' })}
         </div>
       </FilterSection>

       <FilterSection title="Place">
         <div className="text-sm max-h-44 overflow-y-auto pr-1">
           {renderListWithToggle({ items: commonPlaces, keyName: 'places', iconComponent: <MapPin className="w-4 h-4 text-blue-500" />, filterKey: 'places' })}
         </div>
       </FilterSection>

       <FilterSection title="Vehicle Category">
         <div className="flex flex-col gap-2 text-sm">
           {categories.map(cat => (
             <Checkbox 
               key={cat}
               label={cat} 
               icon={<Tag className="w-4 h-4 text-purple-500" />}
               checked={safeFilters.categories?.includes(cat)}
               onChange={() => handleCheckboxChange('categories', cat)}
             />
           ))}
         </div>
       </FilterSection>

       <FilterSection title="Vehicle Make">
         <div>
           <Select 
             placeholder="Select Vehicle Make" 
             options={makes} 
             icon={<Building className="w-4 h-4 text-yellow-500" />}
             value={safeFilters.company}
             onChange={(e) => handleSelectChange('company', e.target.value)}
           />
         </div>
       </FilterSection>

       <FilterSection title="Time of Day">
         <RadioGroup 
           options={timeOfDay} 
           value={safeFilters.timeOfDay || "All"}
           onChange={(value) => handleRadioChange('timeOfDay', value)}
           icons={{
             "Morning": <Sun className="w-4 h-4 text-yellow-500" />,
             "Afternoon": <Sun className="w-4 h-4 text-orange-500" />,
             "Evening": <Sun className="w-4 h-4 text-red-500" />,
             "Midnight": <Moon className="w-4 h-4 text-blue-500" />
           }}
         />
       </FilterSection>

       <FilterSection title="Day of Week">
         <div className="text-sm max-h-44 overflow-y-auto pr-1">
           {renderListWithToggle({ items: days, keyName: 'days', iconComponent: <Clock className="w-4 h-4 text-red-500" />, filterKey: 'days' })}
         </div>
       </FilterSection>

        
     </div>

     <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
       <div className="flex gap-3">
         <button
           onClick={handleResetFilters}
           className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
         >
           <RefreshCw className="w-4 h-4" />
           Reset
         </button>

         <button
           onClick={() => { /* filters update live; keep for clarity */ }}
           className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-md bg-blue-600 text-sm text-white hover:bg-blue-700"
         >
           Apply
         </button>
       </div>
     </div>
   </aside>
  );
};

export default Sidebar;