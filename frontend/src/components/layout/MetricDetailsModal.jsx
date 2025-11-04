import React, { useState, useEffect } from 'react';
import { X, BarChart3, MapPin, Bike, Clock, TrendingUp, Calendar, Users, Award, TrendingDown, Shield, Sun, Moon } from 'lucide-react';

const MetricDetailsModal = ({ isOpen, onClose, metricType, data }) => {
  const [topStations, setTopStations] = useState([]);
  const [topModels, setTopModels] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [totalTheftsData, setTotalTheftsData] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    switch (metricType) {
      case 'highestRiskArea':
        fetch("http://127.0.0.1:8000/api/thefts-by-ps")
          .then(res => res.json())
          .then(response => {
            const sortedStations = response.data
              ?.sort((a, b) => b.count - a.count)
              .slice(0, 5) || [];
            setTopStations(sortedStations);
          })
          .catch(err => console.error("Error fetching top stations:", err));
        break;

      case 'mostStolenModel':
      fetch("http://127.0.0.1:8000/api/most-model")
        .then(res => res.json())
        .then(response => {
          if (!response.data) return;
          setTopModels(response.data.slice(0, 5));
        })
        .catch(err => console.error("Error fetching top models:", err));
      break;


      case 'peakTheftTime':
        fetch("http://127.0.0.1:8000/api/Time_slot-by-company")
          .then(res => res.json())
          .then(response => {
            const timeSlotData = {};
            
            response.data?.forEach(company => {
              ['Morning', 'Afternoon', 'Evening', 'Midnight'].forEach(slot => {
                if (company[slot]) {
                  timeSlotData[slot] = (timeSlotData[slot] || 0) + company[slot];
                }
              });
            });

            const sortedTimeSlots = Object.entries(timeSlotData)
              .map(([timeSlot, count]) => ({ timeSlot, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 4);

            setTimeSlots(sortedTimeSlots);
          })
          .catch(err => console.error("Error fetching time slots:", err));
        break;

      case 'totalThefts':
        // Fetch additional data for total thefts if needed
        setTotalTheftsData({
          last30Days: Math.round(data.total * 0.3), // Example calculation
          resolved: Math.round(data.total * 0.4),   // Example calculation
          investigation: Math.round(data.total * 0.6) // Example calculation
        });
        break;

      default:
        break;
    }
  }, [metricType, isOpen, data]);

  if (!isOpen) return null;

  const getMetricDetails = () => {
    switch (metricType) {
      case 'totalThefts':
        return {
          title: 'Total Thefts Analysis',
          icon: BarChart3,
          description: 'Comprehensive overview of all reported bike thefts',
          data: [
            { label: 'Total Reported Cases', value: data.total || 0 },
            { label: 'Last 30 Days', value: totalTheftsData.last30Days || 'Calculating...' },
            { label: 'Resolved Cases', value: totalTheftsData.resolved || 'Calculating...' },
            { label: 'Under Investigation', value: totalTheftsData.investigation || 'Calculating...' }
          ]
        };   
      
      case 'highestRiskArea':
        return {
          title: 'High Risk Areas Analysis',
          icon: MapPin,
          description: 'Police stations with highest theft concentrations',
          data: [
            { label: 'Highest Risk Station', value: data.station || 'N/A' },
            { label: 'Reported Thefts', value: data.count || 0 },
            { label: 'Percentage of Total', value: data.percentage || 'N/A' },
            { label: 'Trend', value: data.trend || 'Stable' }
          ]
        };
      
      case 'mostStolenModel':
        return {
          title: 'Most Stolen Bike Models',
          icon: Bike,
          description: 'Analysis of frequently stolen bike models',
          data: [
            { label: 'Most Targeted Model', value: data.model || 'N/A' },
            { label: 'Total Incidents', value: data.count || 0 },
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
            { label: 'Peak Time Slot', value: data.timeSlot || 'N/A' },
            { label: 'Incidents Count', value: data.count || 0 },
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

  const getTimeSlotIcon = (timeSlot) => {
    switch (timeSlot) {
      case 'Morning': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'Afternoon': return <Sun className="w-6 h-6 text-orange-500" />;
      case 'Evening': return <Sun className="w-6 h-6 text-red-500" />;
      case 'Midnight': return <Moon className="w-6 h-6 text-blue-500" />;
      default: return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getTimeSlotColor = (timeSlot) => {
    switch (timeSlot) {
      case 'Morning': return 'bg-yellow-100 text-yellow-800';
      case 'Afternoon': return 'bg-orange-100 text-orange-800';
      case 'Evening': return 'bg-red-100 text-red-800';
      case 'Midnight': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRange = (timeSlot) => {
    switch (timeSlot) {
      case 'Morning': return '6:00 AM - 12:00 PM';
      case 'Afternoon': return '12:00 PM - 6:00 PM';
      case 'Evening': return '6:00 PM - 12:00 AM';
      case 'Midnight': return '12:00 AM - 6:00 AM';
      default: return 'Unknown';
    }
  };

  const getTimeSlotDescription = (timeSlot) => {
    switch (timeSlot) {
      case 'Morning': return 'Commute hours, school/office starting times';
      case 'Afternoon': return 'Lunch breaks, shopping hours, low activity periods';
      case 'Evening': return 'Return commute, social activities, dusk hours';
      case 'Midnight': return 'Late night, low visibility, reduced patrols';
      default: return '';
    }
  };

  const getModelIcon = (modelName) => {
    const modelIcons = {
      'Activa': <Bike className="w-6 h-6 text-red-500" />,
      'Pulsar': <Bike className="w-6 h-6 text-blue-500" />,
      'Splendor': <Bike className="w-6 h-6 text-green-500" />,
      'Jupiter': <Bike className="w-6 h-6 text-purple-500" />,
      'Apache': <Bike className="w-6 h-6 text-orange-500" />,
      'Discover': <Bike className="w-6 h-6 text-yellow-600" />,
      'Bullet': <Bike className="w-6 h-6 text-black" />,
      'Duke': <Bike className="w-6 h-6 text-orange-600" />,
      'Ninja': <Bike className="w-6 h-6 text-green-600" />,
      'Access': <Bike className="w-6 h-6 text-gray-500" />,
    };
    
    for (const [key, icon] of Object.entries(modelIcons)) {
      if (modelName?.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return <Bike className="w-6 h-6 text-gray-400" />;
  };

  const getModelCategory = (modelName) => {
    if (modelName?.toLowerCase().includes('activa') || 
        modelName?.toLowerCase().includes('jupiter') || 
        modelName?.toLowerCase().includes('access')) {
      return 'Scooter';
    } else if (modelName?.toLowerCase().includes('pulsar') || 
               modelName?.toLowerCase().includes('splendor') || 
               modelName?.toLowerCase().includes('apache') || 
               modelName?.toLowerCase().includes('discover') ||
               modelName?.toLowerCase().includes('bullet') ||
               modelName?.toLowerCase().includes('duke') ||
               modelName?.toLowerCase().includes('ninja')) {
      return 'Motorcycle';
    }
    return 'Unknown';
  };

  const renderTotalTheftsContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {details.data.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
            <p className="text-lg font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Strategic Overview
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• <strong>Resource Allocation:</strong> Consider increasing patrols in high-density areas</li>
          <li>• <strong>Infrastructure:</strong> Review security camera coverage in theft hotspots</li>
          <li>• <strong>Community Engagement:</strong> Launch public awareness campaigns</li>
          <li>• <strong>Prevention:</strong> Implement bike registration and tracking systems</li>
          <li>• <strong>Data Analysis:</strong> Monitor theft trends for proactive measures</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Impact Assessment
        </h4>
        <p className="text-sm text-green-800">
          Tracking overall theft trends helps allocate resources effectively, measure intervention success, 
          and identify emerging patterns. A comprehensive understanding of total theft volume enables 
          strategic planning and resource optimization across all police stations and time periods.
        </p>
      </div>
    </>
  );

  const renderHighestRiskAreaContent = () => (
    <>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Strategic Insights
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• <strong>Resource Allocation:</strong> Deploy additional patrol units to top 3 stations</li>
          <li>• <strong>Community Engagement:</strong> Launch awareness programs in high-risk areas</li>
          <li>• <strong>Infrastructure:</strong> Install CCTV cameras and better lighting in hotspots</li>
          <li>• <strong>Data Analysis:</strong> Investigate common patterns in top station areas</li>
          <li>• <strong>Prevention:</strong> Coordinate with local businesses for secure parking</li>
        </ul>
      </div>
    </>
  );

  const renderMostStolenModelContent = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Top 5 Most Stolen Bike Models
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {topModels.map((bike, index) => (
            <div 
              key={bike.company} 
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
              
              <div className="flex items-center space-x-3 mb-2">
                {getModelIcon(bike.company)}
                <h4 className="font-bold text-gray-900 text-lg truncate">
                  {bike.company || 'Unknown Brand'}
                </h4>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {bike.count}
                </span>
                <span className="text-sm text-gray-500">
                  thefts
                </span>
              </div>
              
              {topModels.length > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(bike.count / topModels[0].count) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round((bike.count / topModels[0].count) * 100)}% of highest
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 mb-1">Total Brands</p>
            <p className="text-xl font-bold text-red-800">{topModels.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Total Thefts</p>
            <p className="text-xl font-bold text-green-800">
              {topModels.reduce((sum, bike) => sum + bike.count, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Average per Brand</p>
            <p className="text-xl font-bold text-purple-800">
              {topModels.length > 0 
                ? Math.round(topModels.reduce((sum, bike) => sum + bike.count, 0) / topModels.length)
                : 0
              }
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 mb-1">Top Brand Share</p>
            <p className="text-xl font-bold text-orange-800">
              {topModels.length > 0 
                ? `${Math.round((topModels[0].count / topModels.reduce((sum, bike) => sum + bike.count, 0)) * 100)}%`
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-red-900 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Security Insights & Recommendations
        </h3>
        <ul className="text-sm text-red-800 space-y-2">
          <li>• <strong>Targeted Awareness:</strong> Focus security campaigns on owners of top stolen brands</li>
          <li>• <strong>Manufacturer Collaboration:</strong> Work with {topModels[0]?.company || 'leading brands'} on anti-theft features</li>
          <li>• <strong>Insurance Coordination:</strong> Alert insurance companies about high-risk models</li>
          <li>• <strong>Recovery Patterns:</strong> Analyze recovery rates for each brand to identify patterns</li>
          <li>• <strong>Dealer Partnerships:</strong> Engage bike dealers to promote security accessories</li>
        </ul>
      </div>
    </>
  );

  const renderPeakTheftTimeContent = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Theft Distribution by Time of Day
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {timeSlots.map((slot, index) => (
            <div 
              key={slot.timeSlot} 
              className={`p-4 rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                index === 0 ? 'border-yellow-400' : 
                index === 1 ? 'border-gray-400' : 
                index === 2 ? 'border-orange-400' : 'border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(index + 1)}`}>
                  {getRankIcon(index + 1)}
                </div>
                <span className={`text-sm font-semibold ${
                  index === 0 ? 'text-yellow-600' : 
                  index === 1 ? 'text-gray-600' : 
                  index === 2 ? 'text-orange-600' : 'text-blue-600'
                }`}>
                  {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : '4th'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mb-2">
                {getTimeSlotIcon(slot.timeSlot)}
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {slot.timeSlot}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTimeSlotColor(slot.timeSlot)}`}>
                    {getTimeRange(slot.timeSlot)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-2xl font-bold text-gray-800">
                  {slot.count}
                </span>
                <span className="text-sm text-gray-500">
                  thefts
                </span>
              </div>
              
              {timeSlots.length > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        slot.timeSlot === 'Morning' ? 'bg-yellow-500' :
                        slot.timeSlot === 'Afternoon' ? 'bg-orange-500' :
                        slot.timeSlot === 'Evening' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${(slot.count / timeSlots[0].count) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round((slot.count / timeSlots[0].count) * 100)}% of peak
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Peak Hour</p>
            <p className="text-xl font-bold text-purple-800">
              {timeSlots[0]?.timeSlot || 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Total Thefts</p>
            <p className="text-xl font-bold text-green-800">
              {timeSlots.reduce((sum, slot) => sum + slot.count, 0)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Safest Time</p>
            <p className="text-xl font-bold text-blue-800">
              {timeSlots[timeSlots.length - 1]?.timeSlot || 'N/A'}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 mb-1">Peak Share</p>
            <p className="text-xl font-bold text-orange-800">
              {timeSlots.length > 0 
                ? `${Math.round((timeSlots[0].count / timeSlots.reduce((sum, slot) => sum + slot.count, 0)) * 100)}%`
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Time-Based Security Strategy
        </h3>
        <ul className="text-sm text-indigo-800 space-y-2">
          <li>• <strong>Peak Hour Patrols:</strong> Increase police presence during {timeSlots[0]?.timeSlot || 'peak'} hours</li>
          <li>• <strong>Community Awareness:</strong> Alert residents about high-risk time periods</li>
          <li>• <strong>Surveillance Timing:</strong> Optimize CCTV monitoring during high-activity slots</li>
          <li>• <strong>Parking Security:</strong> Enhance bike parking security during vulnerable hours</li>
          <li>• <strong>Shift Planning:</strong> Align security personnel shifts with theft patterns</li>
        </ul>
      </div>
    </>
  );

  const renderDefaultContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {details.data.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
            <p className="text-lg font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Insights & Recommendations
        </h3>
        <p className="text-sm text-blue-800">
          Detailed analysis and recommendations for this metric will be available soon.
        </p>
      </div>
    </>
  );

  const renderContent = () => {
    switch (metricType) {
      case 'totalThefts':
        return renderTotalTheftsContent();
      case 'highestRiskArea':
        return renderHighestRiskAreaContent();
      case 'mostStolenModel':
        return renderMostStolenModelContent();
      case 'peakTheftTime':
        return renderPeakTheftTimeContent();
      default:
        return renderDefaultContent();
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
          {renderContent()}
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