import React, { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider';

const ComingSoonPopup = ({ isOpen, onClose }) => {
  const { currentMode } = useStateContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      return undefined;
    }
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isOpen ? 'bg-black/50 backdrop-blur-md' : 'bg-black/0'
        }`}
        onClick={onClose}
      />

      {/* Popup */}
      <div
        className={`relative w-full max-w-md mx-4 transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div
          className={`relative rounded-2xl shadow-2xl border ${
            currentMode === 'Dark'
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
              currentMode === 'Dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Simple Work in Progress Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2
              className={`text-2xl font-bold mb-4 ${
                currentMode === 'Dark' ? 'text-white' : 'text-gray-800'
              }`}
            >
              Your Subscription Tab Will Be Coming Soon!
            </h2>

            {/* Description */}
            <p
              className={`text-sm mb-8 leading-relaxed ${
                currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Our development team is working hard to give you a seamless access on user subscriptions. 
              Please be a little patient, we're almost there!
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                currentMode === 'Dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPopup; 