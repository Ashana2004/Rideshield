import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import MetricCards from '../components/dashboard/MetricCards';
import HeatmapSection from '../components/dashboard/HeatmapSection';
import TheftByCompanyChart from '../components/charts/TheftByCompanyChart';
import TheftByLocalityChart from '../components/charts/TheftByLocalityChart';
import TheftTrendsChart from '../components/charts/TheftTrendsChart';
import MetricDetailsModal from '../components/layout/MetricDetailsModal';

export default function Dashboard() {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: "",
    localities: [],
    company: "",
    model: "",
    dayOrNight: "",
    theftMethods: []
  });

  const [totalThefts, setTotalThefts] = useState(0);
  const [highestRiskArea, setHighestRiskArea] = useState("");
  const [mostStolenModel, setMostStolenModel] = useState("");
  const [peakTheftTime, setPeakTheftTime] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [metricData, setMetricData] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/total-thefts")
      .then(res => res.json())
      .then(data => {
        setTotalThefts(data.total_thefts);
        setMetricData(prev => ({
          ...prev,
          totalThefts: { total: data.total_thefts }
        }));
      })
      .catch(err => console.error(err));

    fetch("http://127.0.0.1:8000/api/higest-police-station")
      .then(res => res.json())
      .then(data => {
        setHighestRiskArea(`${data.station} (${data.thefts})`);
        setMetricData(prev => ({
          ...prev,
          highestRiskArea: { station: data.station, count: data.thefts }
        }));
      })
      .catch(err => console.error(err));

    fetch("http://127.0.0.1:8000/api/most-model")
      .then(res => res.json())
      .then(data => {
        setMostStolenModel(`${data.most_model} (${data.count})`);
        setMetricData(prev => ({
          ...prev,
          mostStolenModel: { model: data.most_model, count: data.count }
        }));
      })
      .catch(err => console.error(err));

    fetch("http://127.0.0.1:8000/api/peak-time")
      .then(res => res.json())
      .then(data => {
        setPeakTheftTime(`${data.time_slot} (${data.time})`);
        setMetricData(prev => ({
          ...prev,
          peakTheftTime: { timeSlot: data.time_slot, count: data.time }
        }));
      })
      .catch(err => console.error(err));
  }, []);

  const handleMetricClick = (metricType) => {
    setSelectedMetric(metricType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
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
              <HeatmapSection
                dateFrom={filters.dateFrom}
                dateTo={filters.dateTo}
                timeFrom={filters.timeFrom}
                timeTo={filters.timeTo}
                localities={filters.localities.join(",")}
                company={filters.company}
                model={filters.model}
                dayOrNight={filters.dayOrNight}
                theftMethods={filters.theftMethods.join(",")}
              />
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
  );
}