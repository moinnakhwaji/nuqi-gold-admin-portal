import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const Header = ({ category, title }) => {
  const { currentMode } = useStateContext();

  const isDark = currentMode === "Dark";

  return (
    <div className="mb-10 space-y-1">
      <p
        className={`text-sm uppercase tracking-wide font-medium ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {category}
      </p>

      <h1
        className={`text-4xl font-extrabold tracking-tight ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h1>

      <div
        className={`h-1 w-16 rounded-full mt-2 ${
          isDark ? "bg-indigo-500" : "bg-indigo-600"
        }`}
      />
    </div>
  );
};

export default Header;
