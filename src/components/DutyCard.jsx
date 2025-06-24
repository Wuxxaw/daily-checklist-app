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

  // Safely get completed days array (handles both local and Supabase field names)
  const getCompletedDays = () => {
    // Handle both camelCase (local) and snake_case (Supabase) field names
    const completedDays = duty.completedDays || duty.completed_days || [];
    if (!Array.isArray(completedDays)) {
      console.warn('Duty has invalid completedDays format:', duty);
      return [];
    }
    return completedDays;
  };

  // Safely get duty properties with defaults
  const getDutyProperty = (property, defaultValue) => {
    const value = duty[property];
    if (value === undefined || value === null) {
      console.warn(`Duty missing ${property}:`, duty);
      return defaultValue;
    }
    return value;
  };

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
        const completedDays = getCompletedDays();
        const isCompleted = completedDays.includes(dateString);
        const isToday = currentDate.getTime() === today.getTime();
        const isFuture = currentDate > today;
        
        let buttonStyle = {
          borderColor: duty.color,
        };
        let buttonClass = 'w-5 h-5 rounded-full transition-all duration-150 flex items-center justify-center border-2';
        if (isToday) {
          buttonClass += ' shadow-lg';
        }
        if (isFuture) {
          buttonClass += ' bg-white cursor-not-allowed opacity-50';
        } else if (isCompleted) {
          buttonClass += ' text-white';
          buttonStyle.backgroundColor = duty.color;
          buttonStyle.borderColor = duty.color;
          buttonStyle.color = getContrastYIQ(duty.color);
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
            style={buttonStyle}
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
  
  // Get safe values for display
  const completedDays = getCompletedDays();
  const dutyName = getDutyProperty('name', 'Untitled Duty');
  const dutyIcon = getDutyProperty('icon', '📝');
  const dutyColor = getDutyProperty('color', '#1e293b');
  const dutyDuration = getDutyProperty('duration', 66);
  const dutyDescription = getDutyProperty('description', '');
  
  // Helper for contrast text color
  function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    if (hexcolor.length === 3) hexcolor = hexcolor.split('').map(x => x + x).join('');
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#222' : '#fff';
  }

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
        style={{ borderLeft: `6px solid ${dutyColor}` }}
      >
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{dutyIcon}</span>
              <div>
                <h3 className="text-md font-semibold text-gray-800">{dutyName}</h3>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {completedDays.length}/{dutyDuration}
              </span>
              <button onClick={() => onDelete(duty.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50" title="Delete duty">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">{dutyDescription}</p>
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
                className="flex-1 px-4 py-2 rounded-md"
                style={{ backgroundColor: dutyColor, color: getContrastYIQ(dutyColor) }}
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