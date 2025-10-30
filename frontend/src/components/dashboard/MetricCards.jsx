import React from 'react';
import { Shield, MapPin, Bike, Clock } from 'lucide-react';
import MetricCard from '../layout/MetricCard';

const MetricCards = ({ totalThefts, highestRiskArea, mostStolenModel, peakTheftTime , }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <MetricCard 
      icon={Shield} 
      title="Total Thefts" 
      value={totalThefts} 
      subtitle="Based on current filters" 
    />
    <MetricCard 
      icon={MapPin} 
      title="Higest Theft Record to PoliceSation" 
      value={highestRiskArea} 
<<<<<<< HEAD
      // subtitle="" 
=======
      
>>>>>>> 337b5c9f2ed4622466acac1078a3be8738b2712c
      color="text-yellow-600"
    />
    <MetricCard 
      icon={Bike} 
      title="Most Stolen Model" 
      value={mostStolenModel} 
<<<<<<< HEAD
      // subtitle="2 thefts" 
=======
      
>>>>>>> 337b5c9f2ed4622466acac1078a3be8738b2712c
      color="text-blue-600" 
    />
    <MetricCard 
      icon={Clock} 
      title="Peak Theft Time" 
      value={peakTheftTime} 
<<<<<<< HEAD
      // subtitle="1 theft" 
=======
     
>>>>>>> 337b5c9f2ed4622466acac1078a3be8738b2712c
    />
  </div>
);

export default MetricCards;