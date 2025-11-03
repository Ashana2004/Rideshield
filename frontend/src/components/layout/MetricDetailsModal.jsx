import React, { useState, useEffect } from 'react';
import { X, BarChart3, MapPin, Bike, Clock, TrendingUp, Calendar, Users, Award, TrendingDown } from 'lucide-react';

const MetricDetailsModal = ({ isOpen, onClose, metricType, data }) => {
  const [topStations, setTopStations] = useState([]);

  useEffect(() => {
    if (metricType === 'highestRiskArea' && isOpen) {
      // Fetch top police stations data
      fetch("http://127.0.0.1:8000/api/thefts-by-ps")
        .then(res => res.json())
        .then(response => {
          const sortedStations = response.data
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);  
          setTopStations(sortedStations);
        })
        .catch(err => console.error("Error fetching top stations:", err));
    }
  }, [metricType, isOpen]);

  if (!isOpen) return null;

  const getMetricDetails = () => {
    switch (metricType) {
      case 'totalThefts':
        return {
          title: 'Total Thefts Analysis',
          icon: BarChart3,
          description: 'Comprehensive overview of all reported bike thefts',
          data: [
            { label: 'Total Reported Cases', value: data.total },
            { label: 'Last 30 Days', value: data.last30Days || 'N/A' },
            { label: 'Resolved Cases', value: data.resolved || 'N/A' },
            { label: 'Under Investigation', value: data.investigation || 'N/A' }
          ]
        };   
      
      case 'highestRiskArea':
        return {
          title: 'High Risk Areas Analysis',
          icon: MapPin,
          description: 'Police stations with highest theft concentrations',
          data: [
            { label: 'Highest Risk Station', value: data.station },
            { label: 'Reported Thefts', value: data.count },
            { label: 'Percentage of Total', value: data.percentage || 'N/A' },
            { label: 'Trend', value: data.trend || 'Stable' }
          ]
        };
      
      case 'mostStolenModel':
        return {
          title: 'Most Stolen Models',
          icon: Bike,
          description: 'Analysis of frequently stolen bike models',
          data: [
            { label: 'Most Targeted Model', value: data.model },
            { label: 'Total Incidents', value: data.count },
            { label: 'Market Share', value: data.marketShare || 'N/A' },
            { label: 'Recovery Rate', value: data.recoveryRate || 'N/A' }
          ]
        };
      
      case 'peakTheftTime':
        return {
          title: 'Peak Theft Time Analysis',
          icon: Clock,
          description: 'Time patterns and trends in bike theft incidents',
          data: [
            { label: 'Peak Time Slot', value: data.timeSlot },
            { label: 'Incidents Count', value: data.count },
            { label: 'Second Highest', value: data.secondPeak || 'N/A' },
            { label: 'Lowest Activity', value: data.lowest || 'N/A' }
          ]
        };
      
      default:
        return {
          title: 'Metric Details',
          icon: BarChart3,
          description: 'Detailed information about this metric',
          data: []
        };
    }
  };

  const details = getMetricDetails();
  const Icon = details.icon;

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Award className="w-5 h-5" />;
      case 2: return <TrendingUp className="w-5 h-5" />;
      case 3: return <TrendingDown className="w-5 h-5" />;
      default: return <span className="text-sm font-bold">{rank}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <Icon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{details.title}</h2>
              <p className="text-sm text-gray-500">{details.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
           


           
              {/* Top Police Stations Ranking */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Top 5 Police Stations by Theft Incidents
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {topStations.map((station, index) => (
                    <div 
                      key={station.locality} 
                      className={`p-4 rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                        index === 0 ? 'border-yellow-400' : 
                        index === 1 ? 'border-gray-400' : 
                        index === 2 ? 'border-orange-400' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(index + 1)}`}>
                          {getRankIcon(index + 1)}
                        </div>
                        <span className={`text-sm font-semibold ${
                          index === 0 ? 'text-yellow-600' : 
                          index === 1 ? 'text-gray-600' : 
                          index === 2 ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">
                        {station.locality}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-800">
                          {station.count}
                        </span>
                        <span className="text-sm text-gray-500">
                          incidents
                        </span>
                      </div>
                      
                      {/* Progress bar showing relative percentage */}
                      {topStations.length > 0 && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(station.count / topStations[0].count) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {Math.round((station.count / topStations[0].count) * 100)}% of highest
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Total Stations</p>
                    <p className="text-xl font-bold text-blue-800">{topStations.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Total Incidents</p>
                    <p className="text-xl font-bold text-green-800">
                      {topStations.reduce((sum, station) => sum + station.count, 0)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Average per Station</p>
                    <p className="text-xl font-bold text-purple-800">
                      {topStations.length > 0 
                        ? Math.round(topStations.reduce((sum, station) => sum + station.count, 0) / topStations.length)
                        : 0
                      }
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 mb-1">Top Station Share</p>
                    <p className="text-xl font-bold text-orange-800">
                      {topStations.length > 0 
                        ? `${Math.round((topStations[0].count / topStations.reduce((sum, station) => sum + station.count, 0)) * 100)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              </div>
                
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricDetailsModal;