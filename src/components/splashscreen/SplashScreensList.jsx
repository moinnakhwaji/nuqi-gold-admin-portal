import React from "react";
import SplashScreenCard from "./SplashScreenCard";
import { PlusIcon } from "./icons";

// Splash Screens List Component (White Theme)
function SplashScreensList({
  splashScreens,
  selectedSplashId,
  onSelectSplash,
  onToggleActive,
  onDeleteSplash,
  onCreateNew,
}) {
  return (
    <div className="mb-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Splash Screens
        </h2>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-semibold transition-all shadow-sm"
        >
          <PlusIcon />
          <span>Create New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {splashScreens.map((splash) => (
          <SplashScreenCard
            key={splash.id}
            splash={splash}
            isSelected={selectedSplashId === splash.id}
            onSelect={() => onSelectSplash(splash)}
            onToggle={() => onToggleActive(splash.id)}
            onDelete={() => onDeleteSplash(splash.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default SplashScreensList;
