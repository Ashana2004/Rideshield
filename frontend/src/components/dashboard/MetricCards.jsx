import React from 'react';
import { Shield, MapPin, Bike, Clock } from 'lucide-react';
import MetricCard from '../layout/MetricCard';

const MetricCards = ({ totalThefts, highestRiskArea, mostStolenModel, peakTheftTime, onMetricClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <MetricCard 
      icon={Shield} 
      title="Total Thefts" 
      value={totalThefts} 
      subtitle="Based on current filters" 
      onClick={() => onMetricClick('totalThefts')}
    />
    <MetricCard 
      icon={MapPin} 
      title="Highest Theft Record to Police Station" 
      value={highestRiskArea} 
      onClick={() => onMetricClick('highestRiskArea')}
      color="text-yellow-600"
    />
    <MetricCard 
      icon={Bike} 
      title="Most Stolen Model" 
      value={mostStolenModel} 
      onClick={() => onMetricClick('mostStolenModel')}
      color="text-blue-600" 
    />
    <MetricCard 
      icon={Clock} 
      title="Peak Theft Time" 
      value={peakTheftTime} 
      onClick={() => onMetricClick('peakTheftTime')}
    />
  </div>
);

export default MetricCards;