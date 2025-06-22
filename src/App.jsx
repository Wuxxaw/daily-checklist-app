import React, { useState } from 'react';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Navbar from './components/Navbar';

function App() {
  const [activeTab, setActiveTab] = useState('checklist');

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <Stats />;
      case 'checklist':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="transition-opacity duration-300 ease-in-out">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
