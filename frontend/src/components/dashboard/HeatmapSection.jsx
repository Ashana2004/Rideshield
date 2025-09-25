import React from 'react';
import { MapPin, Info } from 'lucide-react';
import HotspotsList from './HotspotsList';
import { topTheftHotspots } from '../../data/mockData';

const HeatmapSection = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="font-semibold text-lg mb-4 flex items-center">
      <MapPin className="w-5 h-5 mr-2 text-blue-600"/>
      Kolhapur City Theft Heatmap
    </h3>
    <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center text-gray-500 mb-6">
      <p className="font-medium">Interactive Kolhapur City Map</p>
      <p className="text-sm">Would show heatmap visualization with theft intensity</p>
      <div className="flex items-center space-x-4 mt-4 text-xs">
        <span className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-400 mr-1.5"></span>Low
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5"></span>Medium
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-400 mr-1.5"></span>High
        </span>
      </div>
    </div>
    <h4 className="font-semibold mb-3">Top Theft Hotspots</h4>
    <HotspotsList hotspots={topTheftHotspots} />
  </div>
);

export default HeatmapSection;