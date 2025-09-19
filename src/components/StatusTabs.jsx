import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';

const StatusTabs = ({ tabs, activeTab, onTabChange, color = 'blue' }) => {
  const { currentMode } = useStateContext();

  return (
    <div className="mb-4">
      <div className="flex justify-start gap-4 p-2">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`capitalize w-[200px] py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.value 
                ? `bg-${color}-500 text-white shadow-md` 
                : `border border-${color}-500 text-${color}-500 hover:bg-${color}-50`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusTabs;
