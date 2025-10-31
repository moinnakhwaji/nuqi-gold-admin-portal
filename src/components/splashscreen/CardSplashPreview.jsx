import React from "react";

// Card Splash Preview (White Theme)
function CardSplashPreview({ editorSettings, renderMediaContent }) {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center p-6">
      <div
        className="rounded-xl p-5 shadow-md border border-gray-200"
        style={{ backgroundColor: editorSettings.bgColor || "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          {renderMediaContent && renderMediaContent(editorSettings, "card")}
        </div>
      </div>
    </div>
  );
}

export default CardSplashPreview;
