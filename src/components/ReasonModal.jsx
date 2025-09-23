import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReasonModal = ({ isOpen, onClose, onConfirm, title = 'Select Reason', userId, bankId }) => {
  // Only log when we have actual data
  if (isOpen && bankId) {
    console.log('📝 Opening modal for Bank ID:', bankId);
  }

  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [onHoldDetails] = useState(null); // keeping only state (setter unused)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reasons
        const reasonsResponse = await fetch('https://mauapi.nuqigold.com/admin/reasons');
        const reasonsData = await reasonsResponse.json();
        console.log('📋 Available reasons:', reasonsData);
        setReasons(reasonsData);

        // Only fetch and log if we have bankId
        if (bankId) {
          const token = localStorage.getItem('authToken');
          console.log('🔍 Fetching on-hold details for Bank ID:', bankId);

          const onHoldResponse = await axios({
            method: 'get',
            url: 'https://uatapi.nuqigold.com/user/onhold_bankKyc/bankId',
            data: {
              bankId: parseInt(bankId, 10),
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('📊 On Hold API Response:', onHoldResponse.data);
          // future use: setOnHoldDetails(onHoldResponse.data[0]);
        }
      } catch (error) {
        console.log('❌ API Error:', error.response?.data || error.message);
      }
    };

    if (isOpen) {
      console.log('🔄 Modal opened, fetching data...');
      setSelectedReason(''); // Reset selection when modal opens
      fetchData();
    }
  }, [isOpen, userId, bankId]);

  const handleConfirm = async () => {
    console.log('🎯 Confirming with reason:', selectedReason);
    if (selectedReason) {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          toast.error('Authentication token not found. Please login again.');
          return;
        }

        const selectedReasonData = reasons.find(
          (reason) => reason.id === parseInt(selectedReason, 10)
        );
        const templateId = selectedReasonData?.templateId;

        console.log('🚀 Sending request with:', {
          userId,
          bankId,
          templateId,
          status: 'on_hold',
        });

        const response = await axios.put(
          `https://uatapi.nuqigold.com/user/onhold_bankKyc/${userId}`,
          {
            status: 'on_hold',
            templateId,
            BankId: parseInt(bankId, 10),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          console.log('✨ Successfully updated KYC status');
          toast.success('KYC status updated to On Hold successfully');
          onConfirm({ reason: selectedReason, templateId });
          setSelectedReason('');
          onClose();
        }
      } catch (error) {
        console.error('❌ Error updating status:', error.response || error);
        toast.error('Failed to update status. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('⚠️ Missing required information');
      toast.error('Please select a reason before confirming.');
    }
  };

  // Return null if the modal is not open to prevent rendering anything
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      aria-labelledby="reason-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Box */}
      <div className="relative w-full max-w-md p-6 mx-4 font-sans bg-white border border-gray-200 rounded-xl shadow-lg text-gray-800">
        {/* Modal Title */}
        <h2
          id="reason-modal-title"
          className="mb-4 text-xl font-bold text-center text-gray-900"
        >
          {title}
        </h2>

        {/* Previous On Hold Details Section (conditionally rendered) */}
        {onHoldDetails && (
          <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="mb-1 text-sm text-gray-600">
              Previous On Hold Details:
            </p>
            <p className="text-gray-800 text-sm">
              Reason: {onHoldDetails.reason}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Last Updated: {new Date(onHoldDetails.updatedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Select Input */}
        <select
          value={selectedReason}
          onChange={(e) => {
            console.log('Selected reason:', e.target.value);
            setSelectedReason(e.target.value);
          }}
          className="w-full p-2.5 mb-5 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition"
        >
          <option value="" disabled className="text-gray-500">
            Select Reason
          </option>
          {reasons.map((reason) => (
            <option key={reason.id} value={reason.id} className="bg-white text-gray-900">
              {reason.reason}
            </option>
          ))}
        </select>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedReason || loading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Submitting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;