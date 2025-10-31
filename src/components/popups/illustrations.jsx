import React from "react";

// ==================== ILLUSTRATION COMPONENTS ====================

export function GoldBoxIllustration({ small }) {
  const boxSize = small ? "w-24 h-24" : "w-56 h-56";
  const mainBoxSize = small ? "w-20 h-20" : "w-40 h-40";

  return (
    <div className={`${boxSize} flex items-center justify-center`}>
      <div className="relative">
        {/* Main Box */}
        <div
          className={`${mainBoxSize} rounded-2xl shadow-2xl relative overflow-hidden`}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #dcdcdc 100%)",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className={`${
                  small ? "text-sm" : "text-3xl"
                } font-bold text-gray-400`}
              >
                NUQI
              </div>
              <div
                className={`${
                  small ? "text-xs" : "text-2xl"
                } font-bold text-gray-400`}
              >
                SILVER
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300/60"></div>
        </div>

        {/* Decorations (visible only for large version) */}
        {!small && (
          <>
            {/* Side Bars */}
            <div className="absolute -right-6 bottom-8 flex flex-col gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-3 rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #f8f8f8 0%, #c0c0c0 100%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                ></div>
              ))}
            </div>

            {/* Bottom Silver Plates */}
            <div
              className="absolute -left-4 bottom-2 w-14 h-6 rounded"
              style={{
                background: "linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
            </div>

            {/* Decorative Circles */}
            <div
              className="absolute -left-8 bottom-0 w-8 h-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #ffffff, #c0c0c0)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
            ></div>

            <div
              className="absolute -right-2 bottom-0 w-7 h-7 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #ffffff, #c0c0c0)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
            ></div>
          </>
        )}
      </div>
    </div>
  );
}
