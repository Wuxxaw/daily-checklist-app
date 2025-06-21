import React, { useState, useEffect } from 'react';
import ChecklistItem from '../components/ChecklistItem';

const Home = () => {
  const defaultChecklist = [
    { id: 1, goalId: 'goal-1', label: 'Drink 2L of water', completed: false, active: true },
    { id: 2, goalId: 'goal-2', label: 'Read 10 pages', completed: false, active: true },
    { id: 3, goalId: 'goal-3', label: 'Exercise for 30 minutes', completed: false, active: true },
    { id: 4, goalId: 'goal-4', label: 'Review daily goals', completed: false, active: true },
  ];

  // Initialize state directly from localStorage
  const getInitialChecklist = () => {
    try {
      const savedData = localStorage.getItem('checklistData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData;
      }
    } catch (error) {
      console.error('Error parsing saved checklist data:', error);
    }
    return defaultChecklist;
  };

  const [checklistItems, setChecklistItems] = useState(getInitialChecklist);
  const [newItemText, setNewItemText] = useState('');
  const [showArchiveMessage, setShowArchiveMessage] = useState(false);

  // Save data to localStorage whenever checklist changes
  useEffect(() => {
    console.log(checklistItems)
    localStorage.setItem('checklistData', JSON.stringify(checklistItems));
  }, [checklistItems]);

  const handleToggleItem = (id) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    // For now, just delete permanently
    // TODO: Add user prompt for delete vs archive choice
    setChecklistItems(prevItems =>
      prevItems.filter(item => item.id !== id)
    );
  };

  const handleArchiveItem = (id) => {
    const itemToArchive = checklistItems.find(item => item.id === id);
    if (itemToArchive) {
      // Save to archived data
      try {
        const existingArchived = localStorage.getItem('archivedChecklistData');
        const archivedItems = existingArchived ? JSON.parse(existingArchived) : [];
        archivedItems.push({ ...itemToArchive, active: false });
        localStorage.setItem('archivedChecklistData', JSON.stringify(archivedItems));
      } catch (error) {
        console.error('Error archiving item:', error);
      }
      
      // Remove from active checklist
      setChecklistItems(prevItems =>
        prevItems.filter(item => item.id !== id)
      );
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now(), // unique item instance
        goalId: `goal-${Date.now()}`, // persistent unique ID for tracking
        label: newItemText.trim(),
        completed: false,
        active: true
      };
      setChecklistItems(prevItems => [...prevItems, newItem]);
      setNewItemText(''); // Clear input
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleMarkAllAsDone = () => {
    setChecklistItems(prevItems =>
      prevItems.map(item => ({ ...item, completed: true }))
    );
  };

  const handleEditItem = (id, newLabel, keepTracking = true) => {
    const originalItem = checklistItems.find(item => item.id === id);
    
    if (keepTracking) {
      // Keep tracking the same goal - just update the label
      setChecklistItems(prevItems =>
        prevItems.map(item => {
          if (item.id === id) {
            return {
              ...item,
              label: newLabel,
              // Keep existing goalId unchanged
            };
          }
          return item;
        })
      );
    } else {
      // Track as new goal - create new item and archive the original
      const newItem = {
        id: Date.now(), // new unique item instance
        goalId: `goal-${Date.now()}`, // new persistent unique ID
        label: newLabel,
        completed: false,
        active: true
      };

      // Archive the original item
      if (originalItem) {
        try {
          const existingArchived = localStorage.getItem('archivedChecklistData');
          const archivedItems = existingArchived ? JSON.parse(existingArchived) : [];
          archivedItems.push({ ...originalItem, active: false });
          localStorage.setItem('archivedChecklistData', JSON.stringify(archivedItems));
          
          console.log(`Goal "${originalItem.label}" archived as new goal "${newLabel}" was created`);
        } catch (error) {
          console.error('Error archiving original item:', error);
        }
      }

      // Replace the original item with the new one
      setChecklistItems(prevItems =>
        prevItems.map(item => 
          item.id === id ? newItem : item
        )
      );

      // Show visual confirmation
      setShowArchiveMessage(true);
      setTimeout(() => setShowArchiveMessage(false), 3000); // Hide after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Today's Checklist
        </h1>
        
        {/* Archive confirmation message */}
        {showArchiveMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
            ✓ Original goal archived. New goal created successfully!
          </div>
        )}
        
        {/* Add new item section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddItem}
              disabled={!newItemText.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Checklist items */}
        <div className="space-y-4 mb-8">
          {checklistItems.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              goalId={item.goalId}
              label={item.label}
              completed={item.completed}
              active={item.active}
              onToggle={() => handleToggleItem(item.id)}
              onDelete={handleDeleteItem}
              onArchive={handleArchiveItem}
              onEdit={handleEditItem}
            />
          ))}
        </div>
        
        <button
          onClick={handleMarkAllAsDone}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
        >
          Mark All as Done
        </button>
      </div>
    </div>
  );
};

export default Home; 