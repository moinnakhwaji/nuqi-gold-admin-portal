import React from "react";

const ChildAccountDetailsModal = ({
  isOpen,
  onClose,
  selectedRecord,
  currentMode,
  onApprove,
  onReject,
  onOnhold,
  // 1. ACCEPT THE NEW PROPS
  onSendReminder,
  isSendingReminder,
  isApproving,
  isRejecting,
  isOnHoldLoading,
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
}) => {
  if (!isOpen || !selectedRecord) return null;

  return (
    <div
      className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-gray-700"
            : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`sticky top-0 z-10 px-6 py-4 border-b ${
            currentMode === "Dark"
              ? "border-gray-700 bg-slate-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Child Account Details</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                currentMode === "Dark"
                  ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {/* --- NO CHANGES IN THE MODAL BODY --- */}
        <div className="p-6 space-y-6">
            {/* ... all your existing JSX for Child and Parent info ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Child Information */}
            <div className="space-y-4">
              <h4
                className={`text-sm font-medium uppercase tracking-wide ${
                  currentMode === "Dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Child Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Child ID
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.id}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Child Name
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.childFirstName &&
                    selectedRecord.childLastName
                      ? `${selectedRecord.childFirstName} ${selectedRecord.childLastName}`
                      : selectedRecord.childFirstName ||
                        selectedRecord.childLastName ||
                        "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Username
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.childUserName || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Date of Birth
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.childDob
                      ? new Date(selectedRecord.childDob).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Relation
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.relation || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedRecord.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedRecord.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : selectedRecord.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedRecord.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedRecord.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : selectedRecord.status === "onhold" || selectedRecord.status === "on_hold"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedRecord.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className="space-y-4">
              <h4
                className={`text-sm font-medium uppercase tracking-wide ${
                  currentMode === "Dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                Parent Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Parent ID
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.parentUser?.id || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Parent Name
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.parentUser?.first_name &&
                    selectedRecord.parentUser?.last_name
                      ? `${selectedRecord.parentUser.first_name} ${selectedRecord.parentUser.last_name}`
                      : selectedRecord.parentUser?.first_name ||
                        selectedRecord.parentUser?.last_name ||
                        "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Email
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.parentUser?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Phone Number
                  </label>
                  <p
                    className={`mt-1 text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRecord.parentUser?.phone_number || "N/A"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    KYC Verified
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedRecord.parentUser?.is_kyc_verified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedRecord.parentUser?.is_kyc_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Document
                  </label>
                  <div className="mt-1">
                    {selectedRecord.document?.documentUrl ? (
                      <a
                        href={selectedRecord.document.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          currentMode === "Dark"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View Document
                      </a>
                    ) : (
                      <span
                        className={`text-xs ${
                          currentMode === "Dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        No document available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
            {selectedRecord.status === "pending" && templates && templates.length > 0 && (
                // ...template selection JSX...
                <div className="space-y-4 border-t pt-4">
                <h4
                  className={`text-sm font-medium uppercase tracking-wide ${
                    currentMode === "Dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  Email Templates
                </h4>
                <div className="space-y-2">
                  <label
                    className={`text-xs font-medium uppercase tracking-wide ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Select Template for Hold/Rejection
                  </label>
                  <select
    value={selectedTemplateId || ""}
    onChange={(e) => setSelectedTemplateId(e.target.value)}
    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
      currentMode === "Dark"
        ? "bg-slate-800 border-gray-600 text-white focus:border-blue-500"
        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
  >
    <option value="">Select a reason...</option>
  
    {templates.map((template) =>
      template.child_reasons.map((reasonObj, idx) => (
        <option key={`${template.id}-${idx}`} value={template.id}>
          {reasonObj.reason}
        </option>
      ))
    )}
  </select>
  
                </div>
              </div>
            )}
        </div>

        {/* Modal Footer */}
        <div
          className={`sticky bottom-0 px-6 py-4 border-t ${
            currentMode === "Dark"
              ? "border-gray-700 bg-slate-900"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {selectedRecord.status === "pending" ? (
                <>
                  <button
                    onClick={() => onApprove(selectedRecord.id)}
                    disabled={isApproving || isRejecting || isOnHoldLoading}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentMode === "Dark"
                        ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50"
                        : "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-400 disabled:opacity-50"
                    } disabled:cursor-not-allowed`}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => onOnhold && onOnhold(selectedRecord.id)}
                    disabled={
                      isApproving || isRejecting || isOnHoldLoading || !onOnhold || !selectedTemplateId
                    }
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentMode === "Dark"
                        ? "bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-800 disabled:opacity-50"
                        : "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-400 disabled:opacity-50"
                    } disabled:cursor-not-allowed`}
                  >
                    {isOnHoldLoading ? "Holding..." : "Hold"}
                  </button>
                  <button
                    onClick={() => onReject(selectedRecord.id)}
                    disabled={isApproving || isRejecting || isOnHoldLoading || !selectedTemplateId}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentMode === "Dark"
                        ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50"
                        : "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-400 disabled:opacity-50"
                    } disabled:cursor-not-allowed`}
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </button>
                </>
              ) : selectedRecord.status === "approved" ? (
                <button
                  disabled
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === "Dark"
                      ? "bg-green-800 text-green-300 opacity-60"
                      : "bg-green-200 text-green-700 opacity-60"
                  } cursor-not-allowed`}
                >
                  Approved
                </button>
              ) : selectedRecord.status === "rejected" ? (
                <button
                  disabled
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === "Dark"
                      ? "bg-red-800 text-red-300 opacity-60"
                      : "bg-red-200 text-red-700 opacity-60"
                  } cursor-not-allowed`}
                >
                  Rejected
                </button>
                
              // 2. REPLACE THE OLD "ONHOLD" BUTTON WITH THE NEW "SEND REMINDER" BUTTON
              ) : selectedRecord.status === "onhold" || selectedRecord.status === "on_hold" ? (
                <button
                  onClick={() => onSendReminder(selectedRecord.id)}
                  disabled={isSendingReminder}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === 'Dark'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800'
                      : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSendingReminder ? "Sending..." : "Send Reminder"}
                </button>
                
              ) : (
                <button
                  disabled
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === "Dark"
                      ? "bg-gray-700 text-gray-400 opacity-60"
                      : "bg-gray-200 text-gray-600 opacity-60"
                  } cursor-not-allowed`}
                >
                  {selectedRecord.status || "Unknown Status"}
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentMode === "Dark"
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildAccountDetailsModal;