import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import TheftEntryModal from './components/theft/TheftEntryModal';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTheftModalOpen, setIsTheftModalOpen] = useState(false);

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
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
            <Sidebar />
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={
              <div className="p-4 sm:p-6 lg:p-8">
                <Dashboard />
              </div>
            } />
            <Route path="/dashboard" element={
              <div className="p-4 sm:p-6 lg:p-8">
                <Dashboard />
              </div>
            } />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
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