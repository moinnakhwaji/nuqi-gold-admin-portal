import React, { useMemo, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const ExchangePickerModal = ({ isOpen, onClose, exchanges = [], onSelect }) => {
  const { currentMode } = useStateContext();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const items = Array.from(new Set(exchanges || []));
    if (!term) return items;
    return items.filter((ex) =>
      String(ex || "")
        .toLowerCase()
        .includes(term));
  }, [exchanges, search]);
  console.log(exchanges);

  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60"
      : "bg-white text-gray-900 border border-gray-200";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-11/12 max-w-lg rounded-2xl ${containerBg} shadow-xl p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Select Exchange</h2>
          <button
            type="button"
            className="text-xl px-2 rounded hover:bg-gray-200/20"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exchange..."
          className={`w-full mb-4 px-3 py-2 rounded-md border ${
            currentMode === "Dark"
              ? "bg-transparent border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        />

        <div className="max-h-72 overflow-y-auto divide-y divide-gray-700/40">
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-blue-600/10 rounded"
            onClick={() => {
              onSelect("");
              onClose();
            }}
          >
            All Exchanges
          </button>
          {filtered.map((ex) => (
            <button
              type="button"
              key={ex}
              className="w-full text-left px-3 py-2 hover:bg-blue-600/10 rounded"
              onClick={() => {
                onSelect(String(ex));
                onClose();
              }}
            >
              {ex || "Unknown"}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-sm text-gray-400">
              No exchanges found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangePickerModal;
