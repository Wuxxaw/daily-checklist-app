import React from 'react';

const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Logo/App name */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">Duty Tracker</h1>
        </div>

        {/* Center - Tab navigation */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => onTabChange('checklist')}
            className={`px-3 py-2 font-medium text-sm transition-colors duration-200 relative ${
              activeTab === 'checklist'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Duties
            {activeTab === 'checklist' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => onTabChange('stats')}
            className={`px-3 py-2 font-medium text-sm transition-colors duration-200 relative ${
              activeTab === 'stats'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Stats
            {activeTab === 'stats' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Settings"
            title="Settings"
          >
            <span className="text-lg">⚙️</span>
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Profile"
            title="Profile"
          >
            <span className="text-lg">👤</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 