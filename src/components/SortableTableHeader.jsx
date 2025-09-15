import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const SortableTableHeader = ({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
  className = "",
}) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";
  const isActive = sortField === field;

  const getSortIndicator = () => {
    if (!isActive) {
      return (
        <div className="relative">
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-all duration-300 ease-out transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        </div>
      );
    }

    return (
      <div className="relative">
        <svg
          className={`w-4 h-4 text-cyan-500 group-hover:text-cyan-400 transform transition-all duration-500 ease-out scale-110
            ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
        <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-pulse blur-sm"></div>
      </div>
    );
  };

  return (
    <th
      className={`group relative px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b cursor-pointer select-none transition-all duration-300 ease-out
        ${isDark
          ? `text-gray-300 border-gray-700/50 hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-slate-700/40 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10
             ${isActive ? 'bg-slate-800/30 text-cyan-400 border-cyan-500/30' : ''}`
          : `text-gray-700 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 hover:text-cyan-600 hover:shadow-lg hover:shadow-cyan-500/5
             ${isActive ? 'bg-blue-50/50 text-cyan-600 border-cyan-500/20' : ''}`
        } 
        hover:border-cyan-500/30 ${className}
      `}
      onClick={() => onSort(field)}
    >
      {/* Subtle background gradient on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg
        ${isDark 
          ? 'bg-gradient-to-r from-cyan-500/5 to-blue-500/5' 
          : 'bg-gradient-to-r from-cyan-500/3 to-blue-500/3'
        }`}
      />
      
      {/* Active state indicator */}
      {isActive && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300
          ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'}
        `} />
      )}

      <div className="relative flex items-center gap-3 group-hover:translate-x-0.5 transition-transform duration-300">
        <span className={`transition-all duration-300 font-medium
          ${isActive 
            ? (isDark ? 'text-cyan-400' : 'text-cyan-600') 
            : 'group-hover:text-cyan-500'
          }
        `}>
          {children}
        </span>
        
        <div className="flex-shrink-0">
          {getSortIndicator()}
        </div>
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/10 scale-0 group-active:scale-100 rounded-full transition-transform duration-200"></div>
      </div>
    </th>
  );
};

export default SortableTableHeader;