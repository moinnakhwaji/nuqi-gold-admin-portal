import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const SearchBox = ({ value, onChange, placeholder = "Search..." }) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-full pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 ease-in-out
          ${isDark
            ? "border border-gray-700 bg-gradient-to-br from-black via-slate-900 to-black text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400"
            : "border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
          }
        `}
      />
      {/* Search Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none
          ${isDark ? "text-gray-400" : "text-gray-500"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
      </svg>
    </div>
  );
};

export default SearchBox;
