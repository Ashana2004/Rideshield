import React from 'react';
import { X, BarChart3, MapPin, Bike, Clock, TrendingUp, Calendar, Users } from 'lucide-react';

const MetricDetailsModal = ({ isOpen, onClose, metricType, data }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
          {/* Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {details.data.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                <p className="text-lg font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Additional Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Insights & Recommendations
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {metricType === 'totalThefts' && (
                <>
                  <li>• Consider increasing patrols in high-density areas</li>
                  <li>• Review security camera coverage in theft hotspots</li>
                  <li>• Launch public awareness campaigns</li>
                </>
              )}
              {metricType === 'highestRiskArea' && (
                <>
                  <li>• Deploy additional resources to this police station</li>
                  <li>• Analyze common factors in this area's thefts</li>
                  <li>• Coordinate with local community watch programs</li>
                </>
              )}
              {metricType === 'mostStolenModel' && (
                <>
                  <li>• Target security awareness for owners of this model</li>
                  <li>• Work with manufacturers on anti-theft features</li>
                  <li>• Track recovery patterns for this specific model</li>
                </>
              )}
              {metricType === 'peakTheftTime' && (
                <>
                  <li>• Adjust patrol schedules to cover peak hours</li>
                  <li>• Implement time-based security measures</li>
                  <li>• Educate public about securing bikes during these times</li>
                </>
              )}
            </ul>
          </div>

          {/* Historical Context */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Historical Context
            </h4>
            <p className="text-sm text-gray-600">
              {metricType === 'totalThefts' && 'Tracking overall theft trends helps allocate resources effectively and measure intervention success.'}
              {metricType === 'highestRiskArea' && 'Identifying high-risk areas enables targeted policing and community engagement strategies.'}
              {metricType === 'mostStolenModel' && 'Understanding model-specific theft patterns informs manufacturer partnerships and owner education.'}
              {metricType === 'peakTheftTime' && 'Time pattern analysis supports optimized resource deployment and preventive measure timing.'}
            </p>
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