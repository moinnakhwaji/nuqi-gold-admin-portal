import React from "react";

const EmailStatusModal = ({ 
  isOpen, 
  onClose, 
  status, // 'success' or 'error'
  message,
}) => {
  if (!isOpen) return null;

  const statusConfig = {
    success: {
      icon: <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
      color: "text-green-600"
    },
    error: {
      icon: <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
      color: "text-red-600"
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6">
          <div className="text-center">
             <div className="flex justify-center mb-4">
               {statusConfig[status].icon}
             </div>
             <h3 className={`text-xl font-semibold mb-2 ${statusConfig[status].color}`}>
               {status === 'success' ? 'Email Sent Successfully!' : 'Failed to Send Email'}
             </h3>
            <p className="text-gray-600">
              {message}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-center gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailStatusModal;
