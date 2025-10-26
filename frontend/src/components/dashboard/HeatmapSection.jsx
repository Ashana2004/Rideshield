import React, { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from "leaflet";
import "../../App.css";

const HeatmapSection = () => {
  const baseUrl = "http://127.0.0.1:8000/api/thefts-heatmap";
  const [activeTab, setActiveTab] = useState('heatmap');
  const [theftData, setTheftData] = useState([]);
  const [selectedTheft, setSelectedTheft] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/theft-data")
      .then(res => res.json())
      .then(theft => setTheftData(theft.data))
      .catch(err => console.error("Error fetching theft-data:", err));
  }, []);

  const smallIcon = new L.Icon.Default({
    iconSize: [15, 25],
    iconAnchor: [7, 25],
    shadowUrl: undefined,   // remove shadow
    shadowSize: [0, 0],
    shadowAnchor: [0, 0],
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Kolhapur City Theft Heatmap
        </h3>
        <div className="flex space-x-6 border-b border-gray-300 mb-4">
          <button
            className={`pb-2 text-lg font-medium ${activeTab === "heatmap"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"}`}
            onClick={() => setActiveTab("heatmap")}
          >
            Heatmap
          </button>
          <button
            className={`pb-2 text-lg font-medium ${activeTab === "Plots"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"}`}
            onClick={() => setActiveTab("Plots")}
          >
            Plots
          </button>
        </div>

        <div className="h-96 w-full mb-6 relative">
          {activeTab === "heatmap" ? (
            <iframe
              key={baseUrl}
              src={baseUrl}
              title="Kolhapur Theft Heatmap"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <div className="relative w-full h-full">
              <MapContainer
                center={[16.5777, 74.3155]}
                zoom={9.3}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {theftData.map((ps, idx) => (
                  <Marker
                    key={idx}
                    position={[ps.LATITUDE, ps.LONGITUDE]}
                    icon={smallIcon}
                    eventHandlers={{ click: () => setSelectedTheft(ps) }}
                  />
                ))}
              </MapContainer>

              {/* Centered Popup */}
              {selectedTheft && (
                <>
                  {/* Dark overlay */}
                  <div className="fixed inset-0 bg-black bg-opacity-40 z-[9998]" />

                  {/* Popup Box */}
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                  bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl shadow-2xl z-[9999] w-96 pointer-events-auto border border-gray-200">
                    
                    {/* Header */}
                    <h2 className="font-bold text-2xl mb-5 text-center text-gray-800 tracking-wide">Theft Details</h2>
                    
                    {/* Details */}
                    <div className="space-y-3">
                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Place:</span> {selectedTheft.PLACE?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Police Station:</span> {selectedTheft.POLICE_STATION?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Category:</span> {selectedTheft.Category?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Make:</span> {selectedTheft.Make?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Time:</span> {selectedTheft.Time_of_day?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                      <p className="text-gray-700"><span className="font-semibold text-gray-900">Day:</span> {selectedTheft.DAY?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                    </div>
                    
                    {/* Close Button */}
                    <button
                      className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition duration-200"
                      onClick={() => setSelectedTheft(null)}
                    >
                      Close
                    </button>
                  </div>


                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeatmapSection;
