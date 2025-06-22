import React, { useState, useEffect } from 'react';

// Helper to get the Monday of a given date's week
const getMonday = (d) => {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const DutyCard = ({ duty, onToggleDay, onDelete }) => {
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
  
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(duty.createdAt);
  startDate.setHours(0, 0, 0, 0);

  const calendarDays = [];
  let currentDate = new Date(startDate);
  while (currentDate <= today) {
    calendarDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const firstDayOfWeek = (startDate.getDay() + 6) % 7;
  
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
          <div className="grid grid-cols-7 gap-1">
            {dayLabels.map((label, index) => (
              <div key={`day-label-${index}`} className="w-5 h-5 flex items-center justify-center">
                <span className="text-xs font-mono text-gray-400">{label}</span>
              </div>
            ))}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="w-5 h-5" />
            ))}
            {calendarDays.map(date => {
              const dateString = date.toISOString().split('T')[0];
              const isCompleted = duty.completedDays.includes(dateString);
              const isToday = date.getTime() === today.getTime();

              let buttonClass = 'w-5 h-5 rounded-full transition-all duration-150 flex items-center justify-center';
              if (isToday) {
                buttonClass += ' ring-2 ring-blue-500';
              }
              if (isCompleted) {
                buttonClass += ` bg-${duty.color}-500 hover:bg-${duty.color}-600 text-white`;
              } else {
                buttonClass += ' bg-gray-200 hover:bg-gray-300';
              }
              
              return (
                <button
                  key={dateString}
                  onClick={() => handleSquareClick(date)}
                  className={buttonClass}
                  title={date.toDateString()}
                >
                  {isCompleted && <span className="text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
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