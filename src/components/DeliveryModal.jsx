import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

const DeliveryModal = ({ isOpen, onClose, deliveryData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!isOpen || !deliveryData) return null;

  return (
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Order Details - {deliveryData.order_id}
          </h3>
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
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Order ID
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {deliveryData.order_id || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    User Nuqi ID
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {deliveryData.user_id || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Current Status
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {deliveryData.status || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Amount (AED)
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-medium">
                    {deliveryData.total_payable_aed || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Delivery Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Address/Emirate
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {deliveryData.emirate || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Estimated Delivery Date
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {deliveryData.estimated_delivery_date
                      ? new Date(deliveryData.estimated_delivery_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Order Date
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {deliveryData.created_at
                      ? new Date(deliveryData.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {deliveryData.updated_at
                      ? new Date(deliveryData.updated_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Details Section */}
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Gold Items Details
            </h4>
            
            {deliveryData.items && deliveryData.items.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium text-gray-900">Total Items: {deliveryData.items.length}</h5>
                    <h5 className="font-medium text-gray-900">
                      Total Quantity: {deliveryData.items.reduce((total, item) => total + (item.qty || 0), 0)}
                    </h5>
                  </div>
                  
                  <div className="space-y-3">
                    {deliveryData.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Item #{index + 1}
                            </label>
                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                              {item.gold_bar_size || "N/A"}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Quantity
                            </label>
                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-medium">
                              {item.qty || "N/A"}
                            </p>
                          </div>
                          
                          {item.sku && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  SKU ID
                                </label>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  {item.sku.id || "N/A"}
                                </p>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  Amount (AED)
                                </label>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-medium">
                                  {item.sku.amount_aed || "N/A"}
                                </p>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  Type
                                </label>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  {item.sku.type || "N/A"}
                                </p>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  SKU Description
                                </label>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  {item.sku.gold_bar_size || "N/A"}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found</p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex gap-3">
            <button
              onClick={() => {
               console.log('View Invoice clicked for order:', deliveryData.order_id);
               window.open(`https://uatapi.nuqigold.com/user/portal/physical-delivery/invoice/${deliveryData.order_id}`, '_blank');
               console.log('Invoice viewed for order:', deliveryData.order_id);
              }}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
            >
              View Invoice
            </button>
            
            <button
              onClick={async () => {
                try {
                  setIsDownloading(true);
                  console.log('Downloading invoice for order:', deliveryData.order_id);
                  
                  // Use axios to get the invoice as blob to bypass CSP
                  const response = await axios.get(`${API_BASE_URL}/user/portal/physical-delivery/invoice/${deliveryData.order_id}`, {
                    responseType: 'blob'
                  });
                  
                  // Create blob from response data
                  const blob = new Blob([response.data], { type: 'application/pdf' });
                  
                  // Create object URL and download
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `invoice_${deliveryData.order_id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                  
                  console.log('Invoice downloaded successfully');
                } catch (error) {
                  console.error('Error downloading invoice:', error);
                  alert('Failed to download invoice. Please try again.');
                } finally {
                  setIsDownloading(false);
                }
              }}
              disabled={isDownloading}
              className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
            >
              {isDownloading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isDownloading ? "Downloading..." : "Download Invoice"}
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;