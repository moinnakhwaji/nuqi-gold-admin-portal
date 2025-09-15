import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';

const StatusToggle = ({ onStatusChange, initialStatus = 'auto_approved' }) => {
  const [status, setStatus] = useState(initialStatus);
  const { currentMode } = useStateContext();

  const handleToggle = () => {
    const newStatus = status === 'auto_approved' ? 'auto_declined' : 'auto_approved';
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <div className={`flex items-center space-x-4 p-4 rounded-lg ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white shadow-sm'}`}>
      
      <div className="flex items-center space-x-3">
        <span className={`text-sm ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Auto Approved
        </span>
        
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            status === 'auto_approved'
              ? 'bg-green-600 focus:ring-green-500'
              : 'bg-red-600 focus:ring-red-500'
          }`}
          role="switch"
          aria-checked={status === 'auto_approved'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              status === 'auto_approved' ? 'translate-x-1' : 'translate-x-6'
            }`}
          />
        </button>
        
        <span className={`text-sm ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Auto Rejected
        </span>
      </div>
    </div>
  );
};

export default StatusToggle; 