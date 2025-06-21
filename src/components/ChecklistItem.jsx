import React, { useState } from 'react';

const ChecklistItem = ({ id, goalId, label, completed = false, active = true, onToggle, onDelete, onArchive, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(label);
  const [showTrackingChoice, setShowTrackingChoice] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditText(label);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(label);
    setShowTrackingChoice(false);
  };

  const handleEditConfirm = (keepTracking) => {
    if (editText.trim()) {
      onEdit(id, editText.trim(), keepTracking);
      setIsEditing(false);
      setShowTrackingChoice(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowTrackingChoice(true);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="space-y-3">
          {/* Edit input */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={id}
              checked={completed}
              onChange={onToggle}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new task..."
              autoFocus
            />
          </div>

          {/* Tracking choice UI */}
          {showTrackingChoice && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-gray-700">How would you like to track this change?</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditConfirm(true)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                >
                  Keep tracking this habit
                </button>
                <button
                  onClick={() => handleEditConfirm(false)}
                  className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
                >
                  Track as new habit
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            {!showTrackingChoice && (
              <button
                onClick={() => setShowTrackingChoice(true)}
                disabled={!editText.trim()}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Save
              </button>
            )}
            <button
              onClick={handleEditCancel}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            id={id}
            checked={completed}
            onChange={onToggle}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label 
            htmlFor={id} 
            className={`text-gray-800 font-medium cursor-pointer flex-1 ${
              completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {label}
          </label>
        </div>
        <div className="flex items-center space-x-1 ml-3">
          {/* Edit button */}
          <button
            onClick={handleEditClick}
            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label="Edit item"
            title="Edit item"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
          </button>
          {/* Archive button - for future use */}
          {onArchive && (
            <button
              onClick={() => onArchive(id)}
              className="p-1 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
              aria-label="Archive item"
              title="Archive item"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" 
                />
              </svg>
            </button>
          )}
          {/* Delete button */}
          <button
            onClick={() => onDelete(id)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            aria-label="Delete item"
            title="Delete item permanently"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistItem; 