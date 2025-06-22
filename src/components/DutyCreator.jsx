import React, { useState } from 'react';

const DutyCreator = ({ isOpen, onClose, onSave, archivedDuties, onReAdd, onDeleteArchived }) => {
  const [view, setView] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📝',
    color: 'blue',
    duration: 66
  });

  const colors = [
    { name: 'blue', class: 'bg-blue-500', border: 'border-blue-500' },
    { name: 'green', class: 'bg-green-500', border: 'border-green-500' },
    { name: 'purple', class: 'bg-purple-500', border: 'border-purple-500' },
    { name: 'red', class: 'bg-red-500', border: 'border-red-500' },
    { name: 'yellow', class: 'bg-yellow-500', border: 'border-yellow-500' },
    { name: 'pink', class: 'bg-pink-500', border: 'border-pink-500' },
    { name: 'indigo', class: 'bg-indigo-500', border: 'border-indigo-500' },
    { name: 'teal', class: 'bg-teal-500', border: 'border-teal-500' }
  ];

  const icons = ['📝', '💪', '🧠', '💧', '📚', '🏃‍♂️', '🧘‍♀️', '🎯', '🔥', '⭐', '🌱', '⚡'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      const newDuty = {
        id: Date.now(),
        ...formData,
        completedDays: [],
        createdAt: new Date().toISOString()
      };
      onSave(newDuty);
      setFormData({ name: '', description: '', icon: '📝', color: 'blue', duration: 66 });
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full lg:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {view === 'create' ? 'Create New Duty' : 'Add Existing Duty'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border-b border-gray-200 mb-4">
            <div className="flex space-x-2">
              <button onClick={() => setView('create')} className={`px-3 py-2 text-sm font-medium ${view === 'create' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Create New</button>
              <button onClick={() => setView('re-add')} className={`px-3 py-2 text-sm font-medium ${view === 're-add' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Add Existing</button>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2">
            {view === 'create' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duty Name</label>
                  <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g., Daily Exercise" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Describe your duty..." rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Choose Icon</label>
                  <div className="grid grid-cols-6 gap-1">
                    {icons.map((icon) => (
                      <button key={icon} type="button" onClick={() => handleInputChange('icon', icon)} className={`p-2 text-lg rounded-md border-2 transition-colors duration-200 ${formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Choose Color</label>
                  <div className="grid grid-cols-8 gap-2">
                    {colors.map((color) => (
                      <button key={color.name} type="button" onClick={() => handleInputChange('color', color.name)} className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${color.class} ${formData.color === color.name ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duration (days)</label>
                  <input type="number" value={formData.duration} onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 66)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" min="1" max="365" />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    It takes <span className="font-bold">66 days</span> to form a <span className="font-bold text-blue-900">Habit</span>. Make it your <span className="font-bold text-blue-900">Duty</span>.
                  </p>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">Save Duty</button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {archivedDuties.length > 0 ? (
                  archivedDuties.map(duty => (
                    <div key={duty.id} className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
                      <div>
                        <span className="text-lg mr-2">{duty.icon}</span>
                        <span className="text-sm font-medium text-gray-800">{duty.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => onReAdd(duty.id)} className="text-sm text-blue-600 hover:underline">Re-add</button>
                        <button onClick={() => onDeleteArchived(duty.id)} className="text-gray-400 hover:text-red-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No archived duties.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DutyCreator; 