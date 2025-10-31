import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";

// Splash Screen Preview Component - White Theme
function SplashScreenPreview({ editorSettings }) {
  const [lottieData, setLottieData] = useState(null);
  const [lottieError, setLottieError] = useState(false);

  useEffect(() => {
    // Fetch Lottie JSON when screen_type is lottie and videoPath exists
    if (editorSettings.screen_type === "lottie" && editorSettings.videoPath) {
      setLottieError(false);

      // Check if it's a data URL or regular URL
      if (editorSettings.videoPath.startsWith("data:")) {
        try {
          // Extract JSON from data URL
          const base64Data = editorSettings.videoPath.split(",")[1];
          const jsonString = atob(base64Data);
          const jsonData = JSON.parse(jsonString);
          setLottieData(jsonData);
        } catch (error) {
          console.error("Error parsing Lottie data URL:", error);
          setLottieError(true);
        }
      } else {
        // Fetch from URL
        fetch(editorSettings.videoPath)
          .then((response) => response.json())
          .then((data) => setLottieData(data))
          .catch((error) => {
            console.error("Error loading Lottie animation:", error);
            setLottieError(true);
          });
      }
    } else {
      setLottieData(null);
    }
  }, [editorSettings.videoPath, editorSettings.screen_type]);

  const renderPreviewContent = () => {
    if (!editorSettings.videoPath) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg
            className="w-20 h-20 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-center">No media uploaded</p>
          <p className="text-xs text-center mt-1 text-gray-400">
            {editorSettings.name || "No splash screen selected"}
          </p>
        </div>
      );
    }

    if (editorSettings.screen_type === "mp4") {
      return (
        <video
          src={editorSettings.videoPath}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          key={editorSettings.videoPath}
        />
      );
    } else if (editorSettings.screen_type === "lottie") {
      if (lottieError) {
        return (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <svg
              className="w-20 h-20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-center font-medium">Error loading Lottie</p>
            <p className="text-xs text-center mt-1">Invalid JSON file</p>
          </div>
        );
      }

      if (!lottieData) {
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
            <p className="text-sm text-center mt-4">Loading animation...</p>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center w-full h-full">
          <Lottie
            animationData={lottieData}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-10">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">
        Splash Screen Preview
      </h2>
      <div className="w-full rounded-xl flex items-center justify-center p-2 min-h-[700px]">
        <div className="bg-gray-200 rounded-[3rem] p-3 shadow-2xl w-[340px] h-[700px]">
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-white">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-200 rounded-b-2xl z-10"></div>

            {/* Preview content */}
            <div className="w-full h-full">
              {renderPreviewContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreenPreview;