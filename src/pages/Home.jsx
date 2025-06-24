import React, { useState, useEffect, useRef } from 'react';
import DutyCard from '../components/DutyCard';
import DutyCreator from '../components/DutyCreator';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Home = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const heroTexts = [
    "Get it done. No excuses.",
    "Keep the streak alive.",
    "One checkbox at a time.",
    "Discipline over motivation.",
    "Show up for yourself.",
    "Small steps, big wins.",
    "Win the day."
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

  const [duties, setDuties] = useState([]);
  const [archivedDuties, setArchivedDuties] = useState(() => getInitialData('archivedDutyData', []));
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(() => Math.floor(Math.random() * heroTexts.length));
  const [fadeState, setFadeState] = useState('in'); // 'in', 'out', 'between'
  const fadeTimeout = useRef(null);
  const intervalRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [showMigrateModal, setShowMigrateModal] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // Check if migration modal should show
  useEffect(() => {
    if (isLoggedIn && !localStorage.getItem('hasMigratedToCloud')) {
      const localDuties = getInitialData('dutyData', []);
      if (localDuties && localDuties.length > 0) {
        setShowMigrateModal(true);
      }
    }
    // eslint-disable-next-line
  }, [isLoggedIn, user]);

  // Fetch duties on mount and when user changes
  useEffect(() => {
    const fetchDuties = async () => {
      if (isLoggedIn) {
        const { data, error } = await supabase
          .from('duties')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (!error) setDuties(data || []);
        else setDuties([]);
      } else {
        setDuties(getInitialData('dutyData', generateDefaultDuties()));
      }
    };
    fetchDuties();
    // eslint-disable-next-line
  }, [isLoggedIn, user]);

  // Save to localStorage if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('dutyData', JSON.stringify(duties));
    }
  }, [duties, isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('archivedDutyData', JSON.stringify(archivedDuties));
  }, [archivedDuties]);

  // Migration logic
  const migrateLocalDutiesToSupabase = async () => {
    setMigrating(true);
    const localDuties = getInitialData('dutyData', []);
    if (!user || !localDuties.length) return;
    const dutiesToInsert = localDuties.map(duty => {
      // Sanitize and validate fields
      return {
        user_id: user.id,
        name: duty.name || '',
        description: duty.description || '',
        icon: duty.icon || '📝',
        color: duty.color || 'blue',
        duration: typeof duty.duration === 'number' && !isNaN(duty.duration) ? duty.duration : 66,
        completed_days: Array.isArray(duty.completedDays) ? duty.completedDays : [],
        created_at: (duty.createdAt && !isNaN(Date.parse(duty.createdAt))) ? duty.createdAt : new Date().toISOString(),
      };
    });
    await supabase.from('duties').insert(dutiesToInsert);
    localStorage.setItem('hasMigratedToCloud', 'true');
    localStorage.removeItem('dutyData');
    setShowMigrateModal(false);
    setMigrating(false);
    // Refetch duties from Supabase
    const { data, error } = await supabase
      .from('duties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (!error) setDuties(data || []);
  };

  const skipMigration = () => {
    localStorage.setItem('hasMigratedToCloud', 'true');
    setShowMigrateModal(false);
  };

  // Save Duty
  const handleSaveDuty = async (newDuty) => {
    if (isLoggedIn) {
      const { data, error } = await supabase.from('duties').insert([
        {
          user_id: user.id,
          name: newDuty.name,
          description: newDuty.description,
          icon: newDuty.icon,
          color: newDuty.color,
          duration: newDuty.duration,
          completed_days: newDuty.completedDays || [],
          created_at: newDuty.createdAt || new Date().toISOString(),
        }
      ]).select();
      if (!error && data) {
        setDuties(prev => [...prev, data[0]]);
      }
    } else {
      setDuties(prev => [...prev, newDuty]);
    }
  };

  // Toggle Day
  const handleToggleDay = async (dutyId, dateString) => {
    if (isLoggedIn) {
      const duty = duties.find(d => d.id === dutyId);
      if (!duty) return;
      const completedSet = new Set(duty.completed_days);
      if (completedSet.has(dateString)) {
        completedSet.delete(dateString);
      } else {
        completedSet.add(dateString);
      }
      const updatedCompleted = Array.from(completedSet);
      const { data, error } = await supabase
        .from('duties')
        .update({ completed_days: updatedCompleted })
        .eq('id', dutyId)
        .eq('user_id', user.id)
        .select();
      if (!error && data) {
        setDuties(prev => prev.map(d => d.id === dutyId ? { ...d, completed_days: updatedCompleted } : d));
      }
    } else {
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
    }
  };

  // Delete Duty
  const handleDeleteDuty = async (dutyId) => {
    if (isLoggedIn) {
      const dutyToArchive = duties.find(d => d.id === dutyId);
      if (dutyToArchive) {
        setArchivedDuties(prev => [...prev, dutyToArchive]);
      }
      const { error } = await supabase
        .from('duties')
        .delete()
        .eq('id', dutyId)
        .eq('user_id', user.id);
      setDuties(prev => prev.filter(d => d.id !== dutyId));
    } else {
      const dutyToArchive = duties.find(d => d.id === dutyId);
      if(dutyToArchive) {
        setArchivedDuties(prev => [...prev, dutyToArchive]);
      }
      setDuties(prev => prev.filter(d => d.id !== dutyId));
    }
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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFadeState('out'); // Start fade-out
      fadeTimeout.current = setTimeout(() => {
        setHeroIndex(prev => (prev + 1) % heroTexts.length);
        setFadeState('between'); // Crossfade
        setTimeout(() => setFadeState('in'), 400); // Fade-in after crossfade
      }, 600); // Fade-out duration
    }, Math.floor(10000 + Math.random() * 5000)); // 10–15s
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(fadeTimeout.current);
    };
  }, []);

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
      {/* Migration Modal */}
      {showMigrateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Migrate Local Duties?</h2>
            <p className="mb-6 text-gray-600">We found local duties from before you signed in. Would you like to migrate them to your account?</p>
            <div className="flex space-x-3">
              <button
                onClick={migrateLocalDutiesToSupabase}
                disabled={migrating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold disabled:opacity-60"
              >
                {migrating ? 'Migrating...' : 'Migrate'}
              </button>
              <button
                onClick={skipMigration}
                disabled={migrating}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-semibold"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`w-full transition-all duration-300 ${isCreatorOpen ? 'lg:mr-96' : ''}`}>
        <div className="max-w-7xl mx-auto mb-8">
          {/* Header - Single Line Layout */}
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
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
            </div>
            <button onClick={() => setIsCreatorOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">New Duty</button>
          </div>
          {/* Motivational message directly under heading, tight spacing */}
          <div className="flex justify-start">
            <span
              className={`text-sm text-gray-500 italic transition-opacity duration-700 ${fadeState === 'in' ? 'opacity-100' : fadeState === 'out' ? 'opacity-0' : 'opacity-100'} pointer-events-none`}
              style={{ position: 'relative', minHeight: 0 }}
              aria-live="polite"
            >
              {heroTexts[heroIndex]}
            </span>
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