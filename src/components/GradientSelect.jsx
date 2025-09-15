import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const GradientSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
  widthClass = "w-52",
}) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const baseContainer = isDark
    ? "bg-gradient-to-br from-black via-slate-900 to-black text-white border border-gray-700/60"
    : "bg-white text-gray-900 border border-gray-300";

  return (
    <div ref={containerRef} className={`relative ${widthClass} ${className}`}>
      <button
        type="button"
        className={`flex items-center justify-between px-3 py-2 rounded-md focus:outline-none ${baseContainer} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : `-- ${placeholder} --`}
        </span>
        <svg
          className="w-4 h-4 ml-2 opacity-80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute z-50 mt-1 max-h-64 overflow-auto rounded-md shadow-lg ${baseContainer}`}
          style={{ left: 0, right: 0 }}
        >
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm opacity-70">No options</div>
          )}
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            let selectedBg = "";
            if (isSelected) {
              selectedBg = isDark ? "bg-white/10" : "bg-gray-100";
            }
            return (
              <button
                type="button"
                key={String(opt.value)}
                className={`block w-full text-left px-3 py-2 text-sm hover:opacity-90 ${selectedBg}`}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GradientSelect;


