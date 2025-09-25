import React from 'react';
import { Info } from 'lucide-react';

const HotspotsList = ({ hotspots }) => (
  <div className="space-y-3">
    {hotspots.map(spot => (
      <div key={spot.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="text-sm font-bold text-gray-500 mr-4">#{spot.id}</div>
          <div>
            <p className="font-semibold text-gray-800">{spot.name}</p>
            <p className="text-xs text-gray-500">{spot.address}</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800">
          <Info className="w-5 h-5"/>
        </button>
      </div>
    ))}
  </div>
);

export default HotspotsList;