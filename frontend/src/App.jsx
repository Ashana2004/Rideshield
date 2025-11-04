import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NewReport from "./pages/newreport";
import TheftEntryModal from './components/theft/TheftEntryModal';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTheftModalOpen, setIsTheftModalOpen] = useState(false);

  // Lifted filters state to App so Sidebar + Dashboard share it
  const [filters, setFilters] = useState({
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
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTheftEntryClick = () => {
    setIsTheftModalOpen(true);
  };

  const handleCloseTheftModal = () => {
    setIsTheftModalOpen(false);
  };

  const handleSubmitTheftReport = (theftData) => {
    console.log('Theft Report Submitted:', theftData);
    setIsTheftModalOpen(false);
    alert('Theft report submitted successfully!');
  };
 
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        onTheftEntryClick={handleTheftEntryClick}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar controlled here */}
        {isSidebarOpen && (
          <Sidebar filters={filters} setFilters={setFilters} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Routes> 
            <Route path="/" element={
              <div className="p-6 sm:p-2 lg:p-6">
                <Dashboard
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
            } />
            <Route path="/dashboard" element={
              <div className="p-4 sm:p-6 lg:p-8">
                <Dashboard
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  filters={filters}
                  setFilters={setFilters}
                />
              </div> 
            } />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/newreport" element={<NewReport />} /> {/* ✅ fixed */}
          </Routes>
        </main>
      </div>

      {/* Theft Entry Modal */}
      <TheftEntryModal
        isOpen={isTheftModalOpen}
        onClose={handleCloseTheftModal}
        onSubmit={handleSubmitTheftReport}
      />
    </div>
  );
}

export default App;
