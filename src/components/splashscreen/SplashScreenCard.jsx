import React from "react";
import { CheckIcon, DeleteIcon, ImagePlaceholderIcon } from "./icons";

// Splash Screen Card Component - White Theme
function SplashScreenCard({
  splash,
  isSelected,
  onSelect,
  onToggle,
  onDelete,
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-5 bg-white rounded-lg border cursor-pointer transition-all hover:bg-gray-50 shadow-sm ${
        isSelected
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-gray-800">
              {splash.name}
            </h3>
            <div className="flex items-center gap-5 mt-1">
              <p className="text-sm text-gray-500">
                {splash.screen_type?.toUpperCase()} - {splash.role}
              </p>
              <p className="text-xs text-gray-400 font-mono">{splash.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-24 rounded-lg mb-3 flex items-center justify-center bg-gray-100">
        {splash.videoPath ? (
          splash.screen_type === "mp4" ? (
            <video
              src={splash.videoPath}
              className="h-full w-full object-contain rounded-lg"
              muted
            />
          ) : (
            <div className="text-gray-500 text-xs text-center">
              <p>Lottie Preview</p>
            </div>
          )
        ) : (
          <ImagePlaceholderIcon />
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            splash.status
              ? "text-emerald-600 bg-emerald-100"
              : "text-gray-600 bg-gray-100"
          }`}
        >
          {splash.status ? "Active" : "Inactive"}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all"
            title="Toggle Status"
          >
            <CheckIcon />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-all"
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SplashScreenCard;