import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, FileText, Calendar, BarChart3, FileDown, ChevronDown } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  // NEW: Theft report submission handler
  const handleSubmitTheftReport = (theftData) => {
    console.log('Theft Report Submitted:', theftData);
    setIsTheftModalOpen(false);
    alert('Theft report submitted successfully!');
    // Here you would typically make an API call to submit the report
  };

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockReports = [
        {
          id: 1,
          reportId: 'RPT-001',
          bikeModel: 'Honda Activa',
          licensePlate: 'MH09AB1234',
          color: 'Black',
          location: 'Shahupuri',
          theftDate: '2024-01-15',
          theftTime: '14:30',
          status: 'Under Investigation',
          submittedDate: '2024-01-15',
          officer: 'Officer Patil',
          contactNumber: '9876543210',
          description: 'Stolen from parking lot'
        },
        {
          id: 2,
          reportId: 'RPT-002',
          bikeModel: 'Bajaj Pulsar',
          licensePlate: 'MH09CD5678',
          color: 'Red',
          location: 'Rajarampuri',
          theftDate: '2024-01-14',
          theftTime: '20:15',
          status: 'Case Closed',
          submittedDate: '2024-01-14',
          officer: 'Officer Desai',
          contactNumber: '9876543211',
          description: 'Recovered near market area'
        },
        {
          id: 3,
          reportId: 'RPT-003',
          bikeModel: 'TVS Jupiter',
          licensePlate: 'MH09EF9012',
          color: 'White',
          location: 'Mahadwar Road',
          theftDate: '2024-01-13',
          theftTime: '09:45',
          status: 'Active',
          submittedDate: '2024-01-13',
          officer: 'Officer Kulkarni',
          contactNumber: '9876543212',
          description: 'Stolen during night'
        },
        {
          id: 4,
          reportId: 'RPT-004',
          bikeModel: 'Hero Splendor',
          licensePlate: 'MH09GH3456',
          color: 'Blue',
          location: 'Shahupuri',
          theftDate: '2024-01-12',
          theftTime: '16:20',
          status: 'Under Investigation',
          submittedDate: '2024-01-12',
          officer: 'Officer Patil',
          contactNumber: '9876543213',
          description: 'Stolen from residential area'
        },
        {
          id: 5,
          reportId: 'RPT-005',
          bikeModel: 'Yamaha MT',
          licensePlate: 'MH09IJ7890',
          color: 'Green',
          location: 'Rajarampuri',
          theftDate: '2024-01-11',
          theftTime: '22:10',
          status: 'Case Closed',
          submittedDate: '2024-01-11',
          officer: 'Officer Desai',
          contactNumber: '9876543214',
          description: 'Vehicle recovered with damage'
        }
      ];
      setReports(mockReports);
      setFilteredReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.bikeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(report => report.theftDate === dateFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(report => report.location === locationFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, dateFilter, statusFilter, locationFilter, reports]);

  // Calculate statistics
  const totalReports = reports.length;
  const underInvestigation = reports.filter(r => r.status === 'Under Investigation').length;
  const casesClosed = reports.filter(r => r.status === 'Case Closed').length;
  const filteredCount = filteredReports.length;

  // Download functions
  const downloadPDF = async () => {
    try {
      // Simulate PDF download
      alert('PDF download started! This would download filtered reports in PDF format.');
      console.log('Downloading PDF with', filteredCount, 'reports');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF report');
    }
  };

  const downloadCSV = async () => {
    try {
      // Simulate CSV download
      alert('CSV download started! This would download filtered reports in CSV format.');
      console.log('Downloading CSV with', filteredCount, 'reports');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV report');
    }
  };

  const downloadWord = async () => {
    try {
      // Simulate Word download
      alert('Word download started! This would download filtered reports in Word format.');
      console.log('Downloading Word with', filteredCount, 'reports');
    } catch (error) {
      console.error('Error downloading Word:', error);
      alert('Error downloading Word report');
    }
  };

  const handleDownload = (format) => {
    setDownloadMenuOpen(false);
    
    switch (format) {
      case 'pdf':
        downloadPDF();
        break;
      case 'csv':
        downloadCSV();
        break;
      case 'word':
        downloadWord();
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-yellow-100 text-yellow-800';
      case 'Case Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueLocations = () => {
    return [...new Set(reports.map(report => report.location))];
  };

  const getUniqueDates = () => {
    return [...new Set(reports.map(report => report.theftDate))];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Theft Reports</h1>
          <p className="text-gray-600">Manage and download bike theft reports with applied filters</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Investigation</p>
                <p className="text-2xl font-bold text-gray-900">{underInvestigation}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cases Closed</p>
                <p className="text-2xl font-bold text-gray-900">{casesClosed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reports by bike model, license plate, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Dates</option>
                {getUniqueDates().map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Case Closed">Case Closed</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Locations</option>
                {getUniqueLocations().map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              {/* Download Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {downloadMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => handleDownload('pdf')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      PDF Format
                    </button>
                    <button
                      onClick={() => handleDownload('csv')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      CSV Format
                    </button>
                    <button
                      onClick={() => handleDownload('word')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Word Format
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Applied Filters Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Applied Filters:</strong> {filteredCount} reports found
              {searchTerm && ` • Search: "${searchTerm}"`}
              {dateFilter && ` • Date: ${new Date(dateFilter).toLocaleDateString()}`}
              {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
              {locationFilter !== 'all' && ` • Location: ${locationFilter}`}
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bike Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {report.reportId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.bikeModel}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.licensePlate} • {report.color}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {report.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(report.theftDate).toLocaleDateString()} at {report.theftTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.contactNumber}
                      {report.officer && (
                        <div className="text-gray-500 text-xs">
                          Officer: {report.officer}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reports found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;