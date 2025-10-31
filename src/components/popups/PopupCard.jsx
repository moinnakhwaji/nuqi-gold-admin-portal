import React from "react";
import { EyeIcon, EditIcon } from "./icons";

// Popup Card Component - White Theme
function PopupCard({ popup, onToggleActive, onPreview, onEdit }) {
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-2 h-12 rounded-full"
            style={{ backgroundColor: popup.color }}
          ></div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{popup.name}</h3>
            <p className="text-sm text-gray-500">{popup.type}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            popup.isActive
              ? "text-emerald-600 bg-emerald-100"
              : "text-gray-600 bg-gray-100"
          }`}
        >
          {popup.isActive ? "Active" : "Inactive"}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all"
            title="Preview"
          >
            <EyeIcon />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all"
            title="Edit"
          >
            <EditIcon />
          </button>
          <label
            className="relative inline-flex items-center cursor-pointer"
            title="Toggle Status"
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive();
            }}
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={popup.isActive}
              readOnly
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default PopupCard;