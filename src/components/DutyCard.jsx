import React, { useState, useEffect } from 'react';

const DutyCard = ({ duty, selectedMonth, onToggleDay, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dontShowWarning, setDontShowWarning] = useState(() => {
    return localStorage.getItem('dontShowOldDateWarning') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('dontShowOldDateWarning', dontShowWarning);
  }, [dontShowWarning]);

  const handleSquareClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    if (date < sevenDaysAgo && !dontShowWarning) {
      setSelectedDate(date);
      setShowConfirmModal(true);
    } else {
      onToggleDay(duty.id, date.toISOString().split('T')[0]);
    }
  };

  const handleConfirmToggle = () => {
    if (selectedDate) {
      onToggleDay(duty.id, selectedDate.toISOString().split('T')[0]);
      setShowConfirmModal(false);
      setSelectedDate(null);
    }
  };

  const renderCalendarGrid = () => {
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get the first day of the selected month
    const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    
    // Get the last day of the selected month
    const lastDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    // Calculate how many days to show before the 1st (to align with Monday)
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    
    // Calculate total days in the month
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Calculate total grid cells needed (including filler days)
    const totalCells = firstDayOfWeek + daysInMonth;
    const rowsNeeded = Math.ceil(totalCells / 7);
    const totalGridCells = rowsNeeded * 7;
    
    const gridItems = [];
    
    // Add day labels
    dayLabels.forEach((label, index) => {
      gridItems.push(
        <div key={`day-label-${index}`} className="w-5 h-5 flex items-center justify-center">
          <span className="text-xs font-mono text-gray-400">{label}</span>
        </div>
      );
    });
    
    // Add all grid cells (filler + actual days)
    for (let i = 0; i < totalGridCells; i++) {
      const isFillerDay = i < firstDayOfWeek || i >= firstDayOfWeek + daysInMonth;
      const dayNumber = i - firstDayOfWeek + 1;
      
      if (isFillerDay) {
        // Render blank space for filler days
        gridItems.push(
          <div key={`filler-${i}`} className="w-5 h-5"></div>
        );
      } else {
        // Render actual day
        const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), dayNumber);
        const dateString = currentDate.toISOString().split('T')[0];
        const isCompleted = duty.completedDays.includes(dateString);
        const isToday = currentDate.getTime() === today.getTime();
        const isFuture = currentDate > today;
        
        let buttonClass = 'w-5 h-5 rounded-full transition-all duration-150 flex items-center justify-center border-2';
        
        if (isToday) {
          buttonClass += ` border-${duty.color}-600 shadow-lg shadow-${duty.color}-200`;
        } else {
          buttonClass += ` border-${duty.color}-300`;
        }
        
        if (isFuture) {
          buttonClass += ' bg-white cursor-not-allowed opacity-50';
        } else if (isCompleted) {
          buttonClass += ` bg-${duty.color}-500 border-${duty.color}-500 text-white`;
        } else {
          buttonClass += ' bg-white hover:bg-gray-50';
        }
        
        const formatDateTooltip = (date) => {
          return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });
        };
        
        gridItems.push(
          <button
            key={`day-${dayNumber}`}
            onClick={() => !isFuture && handleSquareClick(currentDate)}
            className={buttonClass}
            disabled={isFuture}
            title={formatDateTooltip(currentDate)}
          >
            {isCompleted && <span className="text-xs font-bold">✓</span>}
          </button>
        );
      }
    }
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {gridItems}
      </div>
    );
  };
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-${duty.color}-500 flex flex-col h-full`}>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{duty.icon}</span>
              <div>
                <h3 className="text-md font-semibold text-gray-800">{duty.name}</h3>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {duty.completedDays.length}/{duty.duration}
              </span>
              <button onClick={() => onDelete(duty.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50" title="Delete duty">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">{duty.description}</p>
        </div>
        
        <div className="mt-auto pt-2">
          {renderCalendarGrid()}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Past Day?</h3>
            <p className="text-gray-600 mb-6">
              You're editing a date more than 7 days ago. Are you sure?
            </p>
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="dontShowWarning" 
                checked={dontShowWarning} 
                onChange={(e) => setDontShowWarning(e.target.checked)} 
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              />
              <label htmlFor="dontShowWarning" className="ml-2 block text-sm text-gray-700">
                Don't show this warning again
              </label>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmToggle} 
                className={`flex-1 px-4 py-2 text-white bg-${duty.color}-500 hover:bg-${duty.color}-600 rounded-md`}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DutyCard; 