import React, { useState, useEffect } from 'react';
import DutyCard from '../components/DutyCard';
import DutyCreator from '../components/DutyCreator';

const Home = () => {
  const heroTexts = [
    "It's your duty. Track it. Own it.",
    "Nobody else is responsible for your habits.",
    "Get it done. No excuses."
  ];
  
  const generateDefaultDuties = () => {
    const today = new Date();
    const d1 = new Date(today);
    const d2 = new Date(today);
    
    return [
      { id: 1, name: 'Daily Exercise', description: '30 minutes of physical activity', icon: '💪', color: 'emerald', duration: 66, completedDays: Array.from({ length: 15 }, (_, i) => new Date(d1.setDate(d1.getDate() - (i % 2 === 0 ? 1 : 2))).toISOString().split('T')[0]), createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString() },
      { id: 2, name: 'Read 10 Pages', description: 'Daily reading habit', icon: '📚', color: 'blue', duration: 66, completedDays: Array.from({ length: 20 }, (_, i) => new Date(d2.setDate(d2.getDate() - 1)).toISOString().split('T')[0]), createdAt: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString() }
    ];
  };

  const getInitialData = (key, fallback) => {
    try {
      const savedData = localStorage.getItem(key);
      return savedData ? JSON.parse(savedData) : fallback;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return fallback;
    }
  };

  const [duties, setDuties] = useState(() => getInitialData('dutyData', generateDefaultDuties()));
  const [archivedDuties, setArchivedDuties] = useState(() => getInitialData('archivedDutyData', []));
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [heroText, setHeroText] = useState(heroTexts[0]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroTexts.length);
    setHeroText(heroTexts[randomIndex]);
  }, []);

  useEffect(() => {
    localStorage.setItem('dutyData', JSON.stringify(duties));
  }, [duties]);

  useEffect(() => {
    localStorage.setItem('archivedDutyData', JSON.stringify(archivedDuties));
  }, [archivedDuties]);

  const handleToggleDay = (dutyId, dateString) => {
    setDuties(prevDuties =>
      prevDuties.map(duty => {
        if (duty.id === dutyId) {
          const completedSet = new Set(duty.completedDays);
          if (completedSet.has(dateString)) {
            completedSet.delete(dateString);
          } else {
            completedSet.add(dateString);
          }
          return { ...duty, completedDays: [...completedSet] };
        }
        return duty;
      })
    );
  };

  const handleDeleteDuty = (dutyId) => {
    const dutyToArchive = duties.find(d => d.id === dutyId);
    if(dutyToArchive) {
      setArchivedDuties(prev => [...prev, dutyToArchive]);
    }
    setDuties(prev => prev.filter(d => d.id !== dutyId));
  };
  
  const handleSaveDuty = (newDuty) => {
    setDuties(prev => [...prev, newDuty]);
  };
  
  const handleReAddDuty = (dutyId) => {
    const dutyToReAdd = archivedDuties.find(d => d.id === dutyId);
    if (dutyToReAdd) {
      setDuties(prev => [...prev, dutyToReAdd]);
      setArchivedDuties(prev => prev.filter(d => d.id !== dutyId));
    }
  };
  
  const handleDeleteArchivedDuty = (dutyId) => {
    setArchivedDuties(prev => prev.filter(d => d.id !== dutyId));
  };

  const navigateMonth = (direction) => {
    setSelectedMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToCurrentMonth = () => {
    const today = new Date();
    setSelectedMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return selectedMonth.getMonth() === today.getMonth() && 
           selectedMonth.getFullYear() === today.getFullYear();
  };

  return (
    <div className="flex items-start justify-center p-4 pt-8 bg-gray-50 min-h-screen">
      <div className={`w-full transition-all duration-300 ${isCreatorOpen ? 'lg:mr-96' : ''}`}>
        <div className="max-w-7xl mx-auto mb-8">
          {/* Header - Single Line Layout */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Your Duties</h1>
            
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                >
                  ‹
                </button>
                
                <span className="text-lg font-medium text-gray-700 min-w-[120px] text-center">
                  {formatMonthYear(selectedMonth)}
                </span>
                
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                >
                  ›
                </button>
              </div>
              
              {!isCurrentMonth() && (
                <button 
                  onClick={goToCurrentMonth}
                  className="text-sm text-blue-600 hover:text-blue-700 underline px-2 py-1"
                >
                  Back to Current Month
                </button>
              )}
            </div>
            
            <button onClick={() => setIsCreatorOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">New Duty</button>
          </div>

          <p className="text-sm text-gray-500 italic mb-6">{heroText}</p>
        </div>

        <div className="max-w-7xl mx-auto">
          {duties.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No active duties</h3>
              <p className="text-gray-500 mb-6">Create a new duty or re-add an archived one to get started.</p>
              <button onClick={() => setIsCreatorOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">Create Your First Duty</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {duties.map(duty => (
                <DutyCard 
                  key={duty.id} 
                  duty={duty} 
                  selectedMonth={selectedMonth}
                  onToggleDay={handleToggleDay} 
                  onDelete={handleDeleteDuty} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DutyCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSave={handleSaveDuty}
        archivedDuties={archivedDuties}
        onReAdd={handleReAddDuty}
        onDeleteArchived={handleDeleteArchivedDuty}
      />
    </div>
  );
};

export default Home; 