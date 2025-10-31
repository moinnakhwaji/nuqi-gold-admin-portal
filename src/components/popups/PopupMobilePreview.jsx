import React from "react";
import { GoldBoxIllustration } from "./illustrations";

// Popup Mobile Preview Component (White Theme)
function PopupMobilePreview({
  popupTitle,
  popupContent,
  popupImage,
  popupImageSize,
  ctaText,
  allowDismiss,
}) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Mobile Preview
      </h3>

      <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-[2rem] p-2 shadow-2xl w-[260px] h-[520px]">
          <div className="w-full h-full rounded-[1.6rem] overflow-hidden relative bg-gradient-to-b from-white to-gray-100">
            {/* Top Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-4 bg-gray-200 rounded-b-xl z-10"></div>

            {/* Screen Content */}
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-white/70 z-0"></div>

              <div className="absolute bottom-0 left-0 right-0 z-10">
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-t-[1.5rem] px-4 pb-6 pt-4 shadow-xl">
                  {/* Handle Bar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-center text-lg font-bold mb-2"
                    style={{ color: "#3B3B98" }}
                  >
                    {popupTitle || "From App to Doorstep"}
                  </h2>

                  {/* Description */}
                  <p className="text-center text-gray-700 text-xs mb-4 leading-relaxed px-2">
                    {popupContent ||
                      "Get certified 999.9 purity Silver bars securely delivered with live tracking."}
                  </p>

                  {/* Illustration / Image */}
                  <div className="flex justify-center mb-4">
                    {popupImage ? (
                      <img
                        src={popupImage}
                        alt="Popup"
                        className={`object-contain rounded-lg ${
                          popupImageSize === "small"
                            ? "w-16 h-16"
                            : popupImageSize === "large"
                            ? "w-32 h-32"
                            : "w-24 h-24"
                        }`}
                      />
                    ) : (
                      <GoldBoxIllustration small />
                    )}
                  </div>

                  {/* Progress Bars */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div
                      className="w-6 h-0.5 rounded-full bg-gray-300"
                    ></div>
                    <div
                      className="w-6 h-0.5 rounded-full bg-gray-300"
                    ></div>
                    <div
                      className="w-6 h-0.5 rounded-full bg-gray-300"
                    ></div>
                    <div
                      className="w-6 h-0.5 rounded-full bg-indigo-400"
                    ></div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button
                      className="w-full text-white text-xs font-semibold py-3 rounded-xl shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #6B4BA8 0%, #3B3B98 100%)",
                      }}
                    >
                      {ctaText || "Order Now"}
                    </button>

                    {allowDismiss && (
                      <button className="w-full text-gray-600 text-xs font-semibold py-2 rounded-xl bg-transparent hover:bg-gray-100 transition">
                        Maybe Later
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PopupMobilePreview;
