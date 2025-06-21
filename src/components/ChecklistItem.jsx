import React from 'react';

const ChecklistItem = ({ id, label, completed = false, onToggle, onDelete }) => {
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
        <button
          onClick={() => onDelete(id)}
          className="ml-3 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          aria-label="Delete item"
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
  );
};

export default ChecklistItem; 