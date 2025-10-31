import React from "react";
import PopupCard from "./PopupCard";
import { PlusIcon } from "./icons";

// Popups Manager Component (White Theme)
function PopupsManager({ popups, onCreateNew, onToggleActive, onPreview, onEdit }) {
  return (
    <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Popups Manager</h2>
        <button
          onClick={onCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-semibold shadow-md transition-all"
        >
          <PlusIcon className="text-white" />
          <span>Create New Popup</span>
        </button>
      </div>

      {/* Popup Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popups.map((popup) => (
          <PopupCard
            key={popup.id}
            popup={popup}
            onToggleActive={() => onToggleActive(popup.id)}
            onPreview={() => onPreview(popup)}
            onEdit={() => onEdit(popup)}
          />
        ))}
      </div>
    </div>
  );
}

export default PopupsManager;
