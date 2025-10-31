import React from "react";
import { GoldBoxIllustration } from "./illustrations";
import { CloseIcon } from "./icons";

// Bottom Sheet Preview Modal Component - White Theme
function BottomSheetPreview({ popup, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[3rem] p-3 shadow-2xl w-[380px] h-[750px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all z-10"
        >
          <CloseIcon small />
        </button>
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-gradient-to-b from-[#E5E7EB] to-[#F3F4F6]">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-white rounded-b-2xl z-10"></div>
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-white/20 z-0"></div>
            <div className="absolute bottom-0 left-0 right-0 z-10 animate-slideUp">
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-t-[2rem] px-6 pb-8 pt-6 shadow-2xl">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
                <h2
                  className="text-center text-2xl font-bold mb-3"
                  style={{ color: "#6B4BA8" }}
                >
                  {popup?.title || "From App to Doorstep"}
                </h2>
                <p className="text-center text-gray-600 text-sm mb-6 leading-relaxed">
                  {popup?.content ||
                    "Get certified 999.9 purity Gold bars securely delivered with live tracking."}
                </p>
                <div className="flex justify-center mb-6">
                  {popup?.image ? (
                    <img
                      src={popup.image}
                      alt="Popup"
                      className={`object-contain rounded-xl ${
                        popup.imageSize === "small"
                          ? "w-32 h-32"
                          : popup.imageSize === "large"
                          ? "w-64 h-64"
                          : "w-48 h-48"
                      }`}
                    />
                  ) : (
                    <GoldBoxIllustration />
                  )}
                </div>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ background: "#D4AF37" }}
                  ></div>
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ background: "#D4AF37" }}
                  ></div>
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ background: "#D4AF37" }}
                  ></div>
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ background: "#6B4BA8" }}
                  ></div>
                </div>
                <div className="space-y-3">
                  <button
                    className="w-full text-white font-semibold py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                    }}
                  >
                    {popup?.ctaText || "Order Now"}
                  </button>
                  {popup?.allowDismiss && (
                    <button className="w-full text-gray-600 font-semibold py-4 rounded-2xl bg-transparent border-0 hover:text-gray-800 transition-all">
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
  );
}

export default BottomSheetPreview;