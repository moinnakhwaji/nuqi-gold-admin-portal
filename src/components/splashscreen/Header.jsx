import React from "react";

// Header Component (White Theme)
function Header({ onSave }) {
  return (
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-4xl font-bold text-gray-900">Splashscreen Manager</h1>
      <button
        onClick={onSave}
        className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-semibold border border-gray-300 transition-all shadow-sm"
      >
        <span>Save Changes</span>
      </button>
    </header>
  );
}

export default Header;
