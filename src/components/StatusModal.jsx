import React from "react";

const StatusModal = ({ 
  isOpen, 
  onClose, 
  orderData, 
  newStatus, 
  onConfirm, 
  isLoading = false 
}) => {
  if (!isOpen || !orderData) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processed":
        return "text-blue-600";
      case "on_the_way":
        return "text-orange-600";
      case "delivered":
        return "text-green-600";
      default:
        return "text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "On_The_Way":
        return "On The Way";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Status Update
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              You are about to update the status for:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Order ID:</span>
                  <span className="text-sm text-gray-900 font-medium">{orderData.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">User ID:</span>
                  <span className="text-sm text-gray-900 font-medium">{orderData.user_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Current Status:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {orderData.status === "PAYMENT_CONFIRMED" ? "PLACED" : orderData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">From</div>
                  <div className="font-medium text-gray-800 px-3 py-1 bg-gray-100 rounded-lg">
                    {orderData.status === "PAYMENT_CONFIRMED" ? "PLACED" : orderData.status}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">To</div>
                  <div className={`font-medium px-3 py-1 rounded-lg bg-gray-100 ${getStatusColor(newStatus)}`}>
                    {getStatusLabel(newStatus)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  This action cannot be undone. The status will be permanently updated and notifications may be sent to the customer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? "Updating..." : "Confirm Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;