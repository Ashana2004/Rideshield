import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MetricCards from '../components/dashboard/MetricCards';
import HeatmapSection from '../components/dashboard/HeatmapSection';
import TheftByCompanyChart from '../components/charts/TheftByCompanyChart';
import TheftByLocalityChart from '../components/charts/TheftByLocalityChart';
import TheftTrendsChart from '../components/charts/TheftTrendsChart';
import { 
  totalThefts, 
  highestRiskArea, 
  mostStolenModel, 
  peakTheftTime 
} from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Header />
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Kolhapur Bike Theft Analysis Dashboard</h2>
          <p className="text-sm text-gray-500 mb-6">
            Comprehensive analysis and visualization of bike theft patterns across Kolhapur city
          </p>
          
          <MetricCards 
            totalThefts={totalThefts}
            highestRiskArea={highestRiskArea}
            mostStolenModel={mostStolenModel}
            peakTheftTime={peakTheftTime}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HeatmapSection />
            </div>
            
            <div>
              <TheftByCompanyChart />
            </div>

            <div className="lg:col-span-2">
              <TheftByLocalityChart />
            </div>
            
            <div>
              <TheftTrendsChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}