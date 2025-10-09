import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
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
    // Handle the theft report submission here
    console.log('Theft Report Submitted:', theftData);
    // You can add API call here to submit the data to backend
    // Example: fetch('/api/thefts', { method: 'POST', body: JSON.stringify(theftData) })
    setIsTheftModalOpen(false);
    
    // Show success message
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
          <div className="p-4 sm:p-6 lg:p-8">
            <Dashboard />
          </div>
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