import React from "react";

// Full Screen Splash Preview - White Theme
function FullScreenSplashPreview({ editorSettings, renderMediaContent }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: editorSettings.bgColor }}
    >
      <div className="flex flex-col items-center px-6 w-full">
        {renderMediaContent && renderMediaContent(editorSettings, "fullscreen")}
        {editorSettings.imageSize !== "full" && (
          <span className="mt-3 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
            Full Screen
          </span>
        )}
      </div>
    </div>
  );
}

export default FullScreenSplashPreview;