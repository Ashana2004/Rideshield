import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Shield, 
  BarChart3, 
  Settings, 
  Bell, 
  User,
  LogOut,
  ChevronDown,
  Filter,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar, isSidebarOpen, onTheftEntryClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section - Menu Button and Brand */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">BikeGuard</h1>
              <p className="text-xs text-gray-500">Security Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Center Section - Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => handleNavClick('/dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavClick('/reports')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive('/reports')
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="font-medium">Reports</span>
          </button>

          <button
            onClick={() => handleNavClick('/settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Settings</span>
          </button>
        </div>

        {/* Right Section - Report, Sidebar, Notifications, Profile */}
        <div className="flex items-center space-x-3">
          {/* Theft Entry Button */}
          <button
            onClick={onTheftEntryClick}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:block">Report Theft</span>
            <Plus className="w-4 h-4 sm:hidden" />
          </button>

          {/* Sidebar Toggle for Desktop */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@bikeguard.com</p>
                </div>
                <button 
                  onClick={() => {
                    handleNavClick('/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Account Settings
                </button>
                <div className="border-t border-gray-100 mt-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-3 flex justify-center space-x-4 border-t border-gray-100 pt-3">
        <button
          onClick={() => handleNavClick('/dashboard')}
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
            isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => handleNavClick('/reports')}
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
            isActive('/reports') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-xs font-medium">Reports</span>
        </button>

        <button
          onClick={() => handleNavClick('/settings')}
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
            isActive('/settings') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
