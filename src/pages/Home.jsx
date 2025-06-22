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
      { id: 1, name: 'Daily Exercise', description: '30 minutes of physical activity', icon: '💪', color: 'blue', duration: 66, completedDays: Array.from({ length: 15 }, (_, i) => new Date(d1.setDate(d1.getDate() - (i % 2 === 0 ? 1 : 2))).toISOString().split('T')[0]), createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString() },
      { id: 2, name: 'Read 10 Pages', description: 'Daily reading habit', icon: '📚', color: 'green', duration: 66, completedDays: Array.from({ length: 20 }, (_, i) => new Date(d2.setDate(d2.getDate() - 1)).toISOString().split('T')[0]), createdAt: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString() }
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

  return (
    <div className="flex items-start justify-center p-4 pt-8 bg-gray-50 min-h-screen">
      <div className={`w-full transition-all duration-300 ${isCreatorOpen ? 'lg:mr-96' : ''}`}>
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Duties</h1>
              <p className="text-sm text-gray-500 italic">{heroText}</p>
            </div>
            <button onClick={() => setIsCreatorOpen(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">New Duty</button>
          </div>
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
              {duties.map(duty => <DutyCard key={duty.id} duty={duty} onToggleDay={handleToggleDay} onDelete={handleDeleteDuty} />)}
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