import React, { useMemo } from "react";

const GtnResponseModal = ({ isOpen, onClose, gtnResponse, currentMode }) => {
  if (!isOpen) return null;

  const parsed = useMemo(() => {
    try {
      if (!gtnResponse) return {};
      if (typeof gtnResponse === "string") return JSON.parse(gtnResponse);
      if (typeof gtnResponse === "object") return gtnResponse || {};
      return {};
    } catch (_) {
      return {};
    }
  }, [gtnResponse]);

  const flattenJson = (obj, prefix = "") => {
    const result = {};
    Object.keys(obj || {}).forEach((key) => {
      const value = obj[key];
      const prop = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(result, flattenJson(value, prop));
      } else {
        result[prop] = value;
      }
    });
    return result;
  };

  const flat = useMemo(() => flattenJson(parsed), [parsed]);

  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60"
      : "bg-white text-gray-900 border border-gray-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative z-10 w-11/12 max-w-3xl rounded-2xl ${containerBg} shadow-xl`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/60">
          <h2 className="text-lg font-semibold">GTN Response</h2>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Close
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {Object.keys(flat).length === 0 ? (
            <div className="text-sm opacity-70">No GTN response available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(flat).map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs opacity-70 mb-1 break-all">{k}</span>
                  <input
                    readOnly
                    value={v == null ? "N/A" : String(v)}
                    className={`w-full px-3 py-2 rounded-md border ${
                      currentMode === "Dark"
                        ? "bg-black/40 border-gray-700/60 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GtnResponseModal;


