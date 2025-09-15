import React from 'react';
import { FaEye, FaBell, FaEdit, FaSave, FaTimes, FaCheck, FaTimesCircle } from 'react-icons/fa';

const BankDetailModal = ({
  isOpen,
  selectedUser,
  isEditable,
  editedDetails,
  isUpdatingBankDetails,
  isSendingReminder,
  onClose,
  onInputChange,
  onEditClick,
  onSaveChanges,
  onCancelEdit,
  onUpdateKycStatus,
  onSendReminder,
  onReasonModalOpen,
  transformDocumentUrl
}) => {
  if (!isOpen || !selectedUser) return null;

  // Helper to determine tailwind classes based on KYC status
  const getStatusClasses = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'ON_HOLD':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      default:
        return 'bg-amber-100 text-amber-800 border border-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-4xl w-[90%] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Bank Details History - {selectedUser.user_id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {selectedUser.allBankDetails?.map((detail, index) => {
          const kycRecord = selectedUser.kycRecords?.find(kyc => kyc.BankId === detail.id);
          
          return (
            <div 
              key={detail.id} 
              className={`mb-6 p-6 border rounded-lg ${
                index === 0 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold text-lg ${
                  index === 0 ? 'text-blue-800' : 'text-gray-700'
                }`}>
                  {index === 0 ? 'Latest Record' : `Previous Record #${index}`}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(detail.account_status)}`}>
                  {detail.account_status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Holder Name</label>
                  {index === 0 && isEditable ? (
                    <input 
                      name="holder_name" 
                      value={editedDetails.holder_name || ''} 
                      onChange={onInputChange} 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter holder name"
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{detail.holder_name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Account Number</label>
                  {index === 0 && isEditable ? (
                    <input 
                      name="account_number" 
                      value={editedDetails.account_number || ''} 
                      onChange={onInputChange} 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter account number"
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{detail.account_number || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Bank Name</label>
                  {index === 0 && isEditable ? (
                    <input 
                      name="bank_name" 
                      value={editedDetails.bank_name || ''} 
                      onChange={onInputChange} 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter bank name"
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{detail.bank_name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Branch Name</label>
                  {index === 0 && isEditable ? (
                    <input 
                      name="branch_name" 
                      value={editedDetails.branch_name || ''} 
                      onChange={onInputChange} 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter branch name"
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{detail.branch_name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">IFSC/IBAN Code</label>
                  {index === 0 && isEditable ? (
                    <input 
                      name="ifsc_code" 
                      value={editedDetails.ifsc_code || ''} 
                      onChange={onInputChange} 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter IFSC/IBAN code"
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{detail.ifsc_code || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Created At</label>
                  <p className="p-2 bg-gray-100 rounded">
                    {detail.createdAt ? new Date(detail.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* KYC Document Section */}
              {kycRecord && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="mb-4 text-gray-700 font-semibold flex items-center gap-2">
                    <FaEye className="text-blue-500" />
                    KYC Document
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Document Type:</strong> {kycRecord.document_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Document Number:</strong> {kycRecord.document_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(kycRecord.status)}`}>
                            {kycRecord.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Linked Bank ID:</strong> {kycRecord.BankId}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <a 
                        href={transformDocumentUrl(kycRecord.proofdoc)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <FaEye />
                        View Document
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons - Only for latest record */}
              {index === 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 justify-end">
                    {!isEditable ? (
                      <>
                        {detail.account_status === 'UNDER_REVIEW' && kycRecord && (
                          <>
                            <button 
                              onClick={() => onEditClick(detail)} 
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <FaEdit />
                              Edit
                            </button>
                            <button 
                              onClick={() => onReasonModalOpen(kycRecord.id)} 
                              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <FaTimesCircle />
                              On Hold
                            </button>
                            <button 
                              onClick={() => onUpdateKycStatus('APPROVED', kycRecord.id)} 
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <FaCheck />
                              Approve
                            </button>
                            <button 
                              onClick={() => onUpdateKycStatus('REJECTED', kycRecord.id)} 
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <FaTimesCircle />
                              Reject
                            </button>
                          </>
                        )}
                        {detail.account_status?.toLowerCase() === 'on_hold' && (
                          <button 
                            onClick={() => onSendReminder(detail)} 
                            disabled={isSendingReminder} 
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaBell />
                            {isSendingReminder ? 'Sending...' : 'Send Reminder'}
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => onSaveChanges(detail)} 
                          disabled={isUpdatingBankDetails} 
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaSave />
                          {isUpdatingBankDetails ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                          onClick={onCancelEdit} 
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailModal;
