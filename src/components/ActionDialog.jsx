import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const ActionDialog = ({
  isOpen,
  onClose,
  title,
  actionType,
  reason,
  onReasonChange,
  onSubmit,
  isLoading,
}) => {
  const { currentMode } = useStateContext();

  if (!isOpen) return null;

  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60"
      : "bg-white text-gray-900 border border-gray-200";

  const inputBg =
    currentMode === "Dark"
      ? "bg-gray-800 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-11/12 max-w-md rounded-2xl ${containerBg} shadow-xl p-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason Behind{" "}
              {actionType === "activate" ? "Activating" : "Deactivating"}{" "}
              Account
            </label>
            <textarea
              value={reason}
              onChange={onReasonChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 ${inputBg}`}
              placeholder={`Enter reason for ${
                actionType === "activate" ? "activation" : "deactivation"
              }...`}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-md transition-colors ${
                actionType === "activate"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionDialog;
