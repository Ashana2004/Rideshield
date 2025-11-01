import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import MetricCards from '../components/dashboard/MetricCards';
import HeatmapSection from '../components/dashboard/HeatmapSection';
import TheftByCompanyChart from '../components/charts/TheftByCompanyChart';
import TheftByLocalityChart from '../components/charts/TheftByLocalityChart';
import TheftTrendsChart from '../components/charts/TheftTrendsChart';
import MetricDetailsModal from '../components/layout/MetricDetailsModal';

export default function Dashboard({ isSidebarOpen = true, toggleSidebar, filters: parentFilters, setFilters }) {
  // Use filters from App (if passed), otherwise local state fallback
  const [filters, setLocalFilters] = useState(parentFilters || {
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

  // keep parent filters in sync when App passes setFilters
  useEffect(() => {
    if (parentFilters) setLocalFilters(parentFilters);
  }, [parentFilters]);

  useEffect(() => {
    if (setFilters) setFilters(filters);
  }, [filters, setFilters]);

  const [totalThefts, setTotalThefts] = useState(0);
  const [highestRiskArea, setHighestRiskArea] = useState("");
  const [mostStolenModel, setMostStolenModel] = useState("");
  const [peakTheftTime, setPeakTheftTime] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [metricData, setMetricData] = useState({});

  // Helper function to build query string from filters
  const buildQueryString = (customFilters = filters) => {
    const params = new URLSearchParams();
    if (customFilters.localities && customFilters.localities.length > 0) {
      params.append('localities', customFilters.localities.join(','));
    }
    if (customFilters.places && customFilters.places.length > 0) {
      params.append('places', customFilters.places.join(','));
    }
    if (customFilters.company) {
      params.append('company', customFilters.company);
    }
    if (customFilters.categories && customFilters.categories.length > 0) {
      params.append('categories', customFilters.categories.join(','));
    }
    if (customFilters.timeOfDay && customFilters.timeOfDay !== "All") {
      params.append('time_of_day', customFilters.timeOfDay);
    }
    if (customFilters.days && customFilters.days.length > 0) {
      params.append('days', customFilters.days.join(','));
    }
    if (customFilters.spotTypes && customFilters.spotTypes.length > 0) {
      params.append('spot_types', customFilters.spotTypes.join(','));
    }
    
    return params.toString();
  };

  // Fetch data whenever filters change
  useEffect(() => {
    const queryString = buildQueryString();
    
    // Fetch total thefts
    fetch(`http://127.0.0.1:8000/api/total-thefts?${queryString}`)
      .then(res => res.json())
      .then(data => {
        setTotalThefts(data.total_thefts);
        setMetricData(prev => ({
          ...prev,
          totalThefts: { total: data.total_thefts }
        }));
      })
      .catch(err => console.error('Error fetching total thefts:', err));

    // Fetch highest risk area
    fetch(`http://127.0.0.1:8000/api/higest-police-station?${queryString}`)
      .then(res => res.json())
      .then(data => {
        setHighestRiskArea(`${data.station} (${data.thefts})`);
        setMetricData(prev => ({
          ...prev,
          highestRiskArea: { station: data.station, count: data.thefts }
        }));
      })
      .catch(err => console.error('Error fetching highest risk area:', err));

    // Fetch most stolen model
    fetch(`http://127.0.0.1:8000/api/most-model?${queryString}`)
      .then(res => res.json())
      .then(data => {
        setMostStolenModel(`${data.most_model} (${data.count})`);
        setMetricData(prev => ({
          ...prev,
          mostStolenModel: { model: data.most_model, count: data.count }
        }));
      })
      .catch(err => console.error('Error fetching most stolen model:', err));

    // Fetch peak theft time
    fetch(`http://127.0.0.1:8000/api/peak-time?${queryString}`)
      .then(res => res.json())
      .then(data => {
        setPeakTheftTime(`${data.time_slot} (${data.time})`);
        setMetricData(prev => ({
          ...prev,
          peakTheftTime: { timeSlot: data.time_slot, count: data.time }
        }));
      })
      .catch(err => console.error('Error fetching peak time:', err));
  }, [filters]);

  const handleMetricClick = (metricType) => {
    setSelectedMetric(metricType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans text-gray-800">
        
      {/* Main Content */}
      <div className="flex-1">
        <main className="p-4 sm:p-6 lg:p-8">
          <Header />

          <div>
            <h2 className="text-xl font-semibold mb-2">
              Kolhapur Bike Theft Analysis Dashboard
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Comprehensive analysis and visualization of bike theft patterns across Kolhapur city
            </p>

            <MetricCards
              totalThefts={totalThefts}
              highestRiskArea={highestRiskArea}
              mostStolenModel={mostStolenModel}
              peakTheftTime={peakTheftTime}
              onMetricClick={handleMetricClick}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HeatmapSection filters={filters} />
              </div>

              <div>
                <TheftByCompanyChart filters={filters} />
              </div>

              <div className="lg:col-span-2">
                <TheftByLocalityChart filters={filters} />
              </div>

              <div>
                <TheftTrendsChart filters={filters} />
              </div>
            </div>
          </div>

          {/* Metric Details Modal */}
          <MetricDetailsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            metricType={selectedMetric}
            data={metricData[selectedMetric] || {}}
          />
        </main>
      </div>
    </div>
  );
}