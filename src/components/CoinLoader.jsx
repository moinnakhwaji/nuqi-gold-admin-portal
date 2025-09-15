
import React from 'react';

const CoinLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative size-20">
        {/* Outer ring - subtle glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-50 to-indigo-100 shadow-lg" />
        
        {/* Middle ring - spinning with gradient */}
        <div className="absolute inset-2 animate-spin rounded-full bg-gradient-to-r from-blue-100 via-white to-blue-100 shadow-md" />
        
        {/* Inner circle with enhanced styling */}
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white shadow-xl border border-gray-100">
          <span className="text-2xl font-bold bg-gradient-to-br from-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
            $
          </span>
        </div>
        
        {/* Decorative dots */}
        <div className="absolute -top-1 left-1/2 w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
        <div className="absolute -right-1 top-1/2 w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
        <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-purple-200 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
        <div className="absolute -left-1 top-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '1.5s'}} />
      </div>
      
      <div className="mt-6 flex items-center space-x-2">
        <div className="animate-pulse text-lg font-medium text-gray-600">Loading</div>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
        </div>
      </div>
    </div>
  );
};
export default CoinLoader;