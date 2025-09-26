import React from 'react';
import { MapPin } from 'lucide-react';

const HeatmapSection = ({ dateFrom, dateTo, company, dayOrNight }) => {
   
  const baseUrl = "http://127.0.0.1:8000/api/thefts-heatmap";
  const params = new URLSearchParams();
  if (dateFrom) params.append("date_from", dateFrom);
  if (dateTo) params.append("date_to", dateTo);
  if (company) params.append("company", company);
  if (dayOrNight) params.append("day_or_night", dayOrNight);

  const mapUrl = `${baseUrl}?${params.toString()}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-blue-600"/>
        Kolhapur City Theft Heatmap
      </h3>
 
      <div className="h-96 w-full mb-6">
        <iframe
          key={mapUrl}  
          src={mapUrl}
          title="Kolhapur Theft Heatmap"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default HeatmapSection;
