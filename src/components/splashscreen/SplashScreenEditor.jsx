import React from "react";
import { UploadIcon } from "./icons";

// Splash Screen Editor Component (White Theme)
function SplashScreenEditor({
  editorSettings,
  onUpdateSetting,
  onImageUpload,
  imageInputRef,
  onSave,
  isLoading = false,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-5 text-gray-900">
        Splash Screen Editor
      </h2>

      {/* Name */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={editorSettings.name}
          onChange={(e) => onUpdateSetting("name", e.target.value)}
          placeholder="Enter splash screen name"
          className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Screen Type Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Screen Type
        </label>
        <div className="flex space-x-4">
          {["mp4", "lottie"].map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="screen_type"
                value={type}
                checked={editorSettings.screen_type === type}
                onChange={(e) => onUpdateSetting("screen_type", e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload File
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-all bg-gray-50"
          onClick={() => imageInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center text-gray-500">
            <UploadIcon />
            <p className="mt-2 text-sm">
              Drag & drop or{" "}
              <span className="font-semibold text-blue-600">
                click to upload
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {editorSettings.screen_type === "lottie"
                ? "Supports Lottie JSON files"
                : "Supports MP4 videos"}
            </p>
            {editorSettings.videoPath && (
              <p className="mt-2 text-xs text-blue-600 font-medium">
                Current: {editorSettings.videoPath.split("/").pop()}
              </p>
            )}
          </div>
          <input
            ref={imageInputRef}
            className="hidden"
            type="file"
            accept={
              editorSettings.screen_type === "lottie"
                ? ".json,application/json"
                : "video/mp4"
            }
            onChange={onImageUpload}
          />
        </div>
      </div>

      {/* Referral Type */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Referral Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {["USER", "CORPORATE", "FESTIVAL", "CHILD"].map((role) => (
            <label
              key={role}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="role"
                value={role}
                checked={editorSettings.role === role}
                onChange={(e) => onUpdateSetting("role", e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700 capitalize">
                {role.toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Referral Code (Corporate only) */}
      {editorSettings.role === "CORPORATE" && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referral Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., CORP2024"
            value={editorSettings.referralcode || ""}
            onChange={(e) => onUpdateSetting("referralcode", e.target.value)}
            className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          <p className="text-xs text-gray-500 mt-2">
            Required for corporate splash screens
          </p>
        </div>
      )}

      {/* Status Toggle */}
      <div className="mb-5">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={editorSettings.status}
            onChange={(e) => onUpdateSetting("status", e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">
            Active Status
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-2 ml-8">
          When enabled, this splash screen will be active
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default SplashScreenEditor;
