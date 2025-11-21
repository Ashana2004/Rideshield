import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, FileText,  BarChart3, FileDown, ChevronDown } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

 
  const handleSubmitTheftReport = (theftData) => {
    console.log('Theft Report Submitted:', theftData);
    setIsTheftModalOpen(false);
    alert('Theft report submitted successfully!');
     
  };

   
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      fetch("http://127.0.0.1:8000/api/theft-data")
      .then(res=>res.json())
      .then(data=>{
         console.log(data.data);
      setReports(data.data);
      setFilteredReports(data.data);
      setLoading(false);
      })
    }, 1000);
  }, []);


  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.MAKE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.POLICE_STATION.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.CaseNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(report => report.DATE === dateFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.STATUS === statusFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(report => report.POLICE_STATION === locationFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, dateFilter, statusFilter, locationFilter, reports]);

 
  const totalReports = reports.length;
  const underInvestigation = reports.filter(r => r.STATUS === 'Under Investigation').length;
  const casesClosed = reports.filter(r => r.STATUS === 'Case Closed').length;
  const filteredCount = filteredReports.length;

  // Download functions
  const downloadPDF = async () => {
  const response = await fetch("http://localhost:8000/api/download/pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(filteredReports)
});

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "filtered_reports.pdf";
  a.click();
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

  const getStatusColor = (STATUS) => {
    switch (STATUS) {
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-yellow-100 text-yellow-800';
      case 'Case Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const parseCustomDate = (d) => {
  if (!d) return "";
  const parts = d.split(".");
  if (parts.length !== 3) return "";

  let [day, month, year] = parts.map(Number);

  // Convert 25 → 2025
  year = year < 100 ? 2000 + year : year;

  return new Date(year, month - 1, day);
};
  const getUniqueLocations = () => {
    return [...new Set(reports.map(report => report.POLICE_STATION))];
  };

  const getUniqueDates = () => {
    return [...new Set(reports.map(report => report.DATE))];
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
const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
                          { capitalize(report.CaseNo) }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          { capitalize(report.MAKE) }
                        </div>
                        <div className="text-sm text-gray-500">
                          {capitalize(report.Make)} • {capitalize(report.Category)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {capitalize(report.POLICE_STATION)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(report.DATE).toLocaleDateString()} at {capitalize(report.Time_of_day)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {"Case" + " " + report.STATUS}
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