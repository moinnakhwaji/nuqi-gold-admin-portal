import React, { useRef } from "react";
import { CloseIcon, UploadIcon } from "./icons";

// Create Splash Modal Component - White Theme
function CreateSplashModal({
  formData,
  onFormChange,
  uploadedFile,
  onFileUpload,
  onCreate,
  onClose,
  isLoading = false,
}) {
  const fileInputRef = useRef(null);

  return (
    <div
      className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Splash Screen
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Summer Campaign"
            value={formData.name}
            onChange={(e) => onFormChange("name", e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Screen Type */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-3">
            Screen Type <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="create_screen_type"
                value="mp4"
                checked={formData.screen_type === "mp4"}
                onChange={(e) => onFormChange("screen_type", e.target.value)}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">MP4</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="create_screen_type"
                value="lottie"
                checked={formData.screen_type === "lottie"}
                onChange={(e) => onFormChange("screen_type", e.target.value)}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Lottie</span>
            </label>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Upload File <span className="text-red-500">*</span>
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center text-gray-500">
              <UploadIcon />
              <p className="mt-2 text-sm">
                Drag & drop or{" "}
                <span className="font-semibold text-emerald-600">
                  click to upload
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {formData.screen_type === "lottie"
                  ? "Supports Lottie JSON files"
                  : "Supports MP4 videos"}
              </p>
              {uploadedFile && (
                <p className="mt-2 text-xs text-emerald-600">
                  Selected: {uploadedFile.name}
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept={
                formData.screen_type === "lottie"
                  ? ".json,application/json"
                  : "video/mp4"
              }
              onChange={onFileUpload}
            />
          </div>
        </div>

        {/* Referral Type */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-3">
            Referral Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="create_role"
                value="USER"
                checked={formData.role === "USER"}
                onChange={(e) => onFormChange("role", e.target.value)}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">User</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="create_role"
                value="CORPORATE"
                checked={formData.role === "CORPORATE"}
                onChange={(e) => onFormChange("role", e.target.value)}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Corporate</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="create_role"
                value="FESTIVAL"
                checked={formData.role === "FESTIVAL"}
                onChange={(e) => onFormChange("role", e.target.value)}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Festival</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="create_role"
                value="CHILD"
                checked={formData.role === "CHILD"}
                onChange={(e) => onFormChange("role", e.target.value)}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Child</span>
            </label>
          </div>
        </div>

        {/* Referral Code - Only shown when CORPORATE is selected */}
        {formData.role === "CORPORATE" && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Referral Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., CORP2024"
              value={formData.referralcode || ""}
              onChange={(e) => onFormChange("referralcode", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Required for corporate splash screens
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
          >
            {isLoading ? "Creating..." : "Create Splash Screen"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSplashModal;