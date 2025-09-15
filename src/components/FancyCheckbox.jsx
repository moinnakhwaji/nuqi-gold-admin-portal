import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const FancyCheckbox = ({ label, checked, onChange, name }) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const baseOff = isDark
    ? "bg-black/30 text-gray-200 border border-gray-700/60"
    : "bg-white text-gray-800 border border-gray-300";

  const baseOn = isDark
    ? "text-white border-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-[0_0_0_1px_rgba(59,130,246,0.6)]"
    : "text-white border-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow";

  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 peer-focus:ring-2 ring-offset-1 ring-blue-500 ${
          checked ? baseOn : baseOff
        }`}
      >
        <span
          className={`inline-flex h-4 w-4 items-center justify-center rounded-md border ${(() => {
            if (checked) return "bg-white/20 border-white/60";
            if (isDark) return "bg-black/20 border-gray-600";
            return "bg-white border-gray-300";
          })()}`}
        >
          {checked && (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </span>
    </label>
  );
};

export default FancyCheckbox;


