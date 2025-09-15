import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  backendLimit,
  recordsCount,
  showRecordsInfo = true,
}) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const getPageButtonClassName = (page) => {
    if (currentPage === page) {
      return `
        ${isDark 
          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border-cyan-500' 
          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 border-blue-500'
        } 
        transform scale-105 font-semibold
      `;
    }
    
    if (isDark) {
      return "text-gray-300 bg-slate-800 border border-gray-600 hover:bg-slate-700 hover:text-cyan-400 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10";
    }
    
    return "text-gray-600 bg-white border border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10";
  };

  const getNavButtonClassName = (disabled = false) => {
    const baseClasses = "px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-300 ease-out";
    
    if (disabled) {
      return `${baseClasses} opacity-40 cursor-not-allowed ${
        isDark 
          ? 'text-gray-500 bg-slate-800 border-gray-700' 
          : 'text-gray-400 bg-gray-100 border-gray-200'
      }`;
    }
    
    if (isDark) {
      return `${baseClasses} text-gray-300 bg-slate-800 border-gray-600 hover:bg-slate-700 hover:text-cyan-400 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 active:scale-95`;
    }
    
    return `${baseClasses} text-gray-600 bg-white border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 active:scale-95`;
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  // Calculate the range of pages to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i += 1
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 rounded-xl border backdrop-blur-sm
      ${isDark 
        ? 'bg-slate-900/50 border-gray-700/50 shadow-2xl shadow-slate-900/20' 
        : 'bg-white/80 border-gray-200/50 shadow-2xl shadow-gray-900/5'
      }`}
    >
      {/* Navigation Controls */}
      <div className="flex items-center space-x-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={getNavButtonClassName(currentPage === 1)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </div>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <div className={`px-3 py-2 text-sm select-none
                  ${isDark ? "text-gray-500" : "text-gray-400"}
                `}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ease-out hover:scale-110 active:scale-95 min-w-[40px] ${getPageButtonClassName(page)}`}
                >
                  <span className="relative z-10">{page}</span>
                  {currentPage === page && (
                    <div className={`absolute inset-0 rounded-lg blur-sm opacity-50
                      ${isDark ? 'bg-cyan-500' : 'bg-blue-500'}
                    `} />
                  )}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={getNavButtonClassName(currentPage === totalPages)}
        >
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Page Info */}
      <div className={`flex flex-col sm:flex-row items-center gap-4 text-sm
        ${isDark ? "text-gray-300" : "text-gray-600"}
      `}>
        {showRecordsInfo && recordsCount > 0 && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm
            ${isDark 
              ? 'bg-slate-800/50 border-gray-700/50' 
              : 'bg-gray-50/80 border-gray-200/50'
            }`}
          >
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">
              Showing{" "}
              <span className="text-cyan-500 font-semibold">
                {recordsCount === 0 ? 0 : (currentPage - 1) * backendLimit + 1}
              </span>
              {" "}to{" "}
              <span className="text-cyan-500 font-semibold">
                {Math.min(currentPage * backendLimit, totalRecords)}
              </span>
              {" "}of{" "}
              <span className="text-cyan-500 font-semibold">{totalRecords}</span>
              {" "}records
            </span>
          </div>
        )}
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm
          ${isDark 
            ? 'bg-slate-800/50 border-gray-700/50' 
            : 'bg-gray-50/80 border-gray-200/50'
          }`}
        >
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">
            Page{" "}
            <span className="text-blue-500 font-semibold">{currentPage}</span>
            {" "}of{" "}
            <span className="text-blue-500 font-semibold">{totalPages}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;