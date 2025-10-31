import React from "react";
import { CloseIcon } from "./icons";

// Full Screen Preview Modal Component (White Theme)
function FullScreenPreview({ editorSettings, onClose, renderMediaContent }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: editorSettings.enableFullScreenSplash
          ? editorSettings.bgColor || "#ffffff"
          : "#f9fafb",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-black/10 hover:bg-black/20 text-gray-800 transition-all z-10"
        title="Exit Full Screen"
      >
        <CloseIcon />
      </button>
      {editorSettings.enableFullScreenSplash ? (
        <div className="w-full h-full flex items-center justify-center transition-colors duration-300 relative">
          {renderMediaContent && renderMediaContent(editorSettings, "fullscreen-modal")}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="max-w-md w-full mx-auto bg-gradient-to-b from-white to-gray-100 rounded-2xl p-8 border border-gray-300 shadow-md"
            style={{ backgroundColor: editorSettings.bgColor || "#ffffff" }}
          >
            <div className="flex flex-col items-center">
              {renderMediaContent && renderMediaContent(editorSettings, "card-modal")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FullScreenPreview;
