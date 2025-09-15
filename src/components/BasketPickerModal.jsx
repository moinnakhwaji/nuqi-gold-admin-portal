import React, { useMemo, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const BasketPickerModal = ({
  isOpen,
  onClose,
  baskets = [],
  onSelect,
  initialSelectedId = "",
}) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const [basketSearch, setBasketSearch] = useState("");
  const [activeBasketId, setActiveBasketId] = useState(initialSelectedId || (baskets[0]?.id ?? ""));

  const filteredBaskets = useMemo(() => {
    const term = basketSearch.trim().toLowerCase();
    if (!term) return baskets;
    return baskets.filter((b) => String(b.cep_name || "").toLowerCase().includes(term));
  }, [baskets, basketSearch]);

  const activeBasket = useMemo(
    () => baskets.find((b) => String(b.id) === String(activeBasketId)),
    [baskets, activeBasketId]
  );

  if (!isOpen) return null;

  const containerBg = isDark
    ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60"
    : "bg-white text-gray-900 border border-gray-300";

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-[90vw] max-w-5xl rounded-xl shadow-xl ${containerBg}`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold">Select a Basket</h3>
          <button type="button" onClick={onClose} className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Close</button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Search baskets..."
              value={basketSearch}
              onChange={(e) => setBasketSearch(e.target.value)}
              className={`w-full px-3 py-2 rounded-md focus:outline-none ${isDark ? "bg-black/30 text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`}
            />
            <div className="mt-3 max-h-72 overflow-auto rounded-md border border-gray-700/40">
              {filteredBaskets.map((b) => {
                const isActive = String(b.id) === String(activeBasketId);
                const rowBg = isActive ? "bg-white/10" : "hover:bg-white/5";
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setActiveBasketId(b.id)}
                    className={`w-full text-left px-3 py-2 border-b border-gray-700/30 ${rowBg}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{b.cep_name}</span>
                      <span className="text-xs opacity-70">{Array.isArray(b.cep_stock) ? b.cep_stock.length : 0} stocks</span>
                    </div>
                  </button>
                );
              })}
              {filteredBaskets.length === 0 && (
                <div className="px-3 py-6 text-sm opacity-70 text-center">No baskets found</div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold">Stocks</h4>
              <button
                type="button"
                disabled={!activeBasketId}
                onClick={() => {
                  if (activeBasketId) onSelect?.(activeBasketId);
                  onClose?.();
                }}
                className={`px-4 py-2 rounded-md text-white ${!activeBasketId ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                Use This Basket
              </button>
            </div>
            <div className="mt-3 max-h-80 overflow-auto rounded-md border border-gray-700/40">
              <table className="w-full text-sm">
                <thead className="bg-black/30">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Symbol</th>
                    <th className="text-left p-2">Exchange</th>
                    <th className="text-left p-2">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeBasket?.cep_stock || []).map((s) => (
                    <tr key={s.stock_id} className="border-b border-gray-700/30">
                      <td className="p-2">{s.stock?.name}</td>
                      <td className="p-2">{s.stock?.symbol}</td>
                      <td className="p-2">{s.stock?.exchange}</td>
                      <td className="p-2">{s.volume}</td>
                    </tr>
                  ))}
                  {(!activeBasket || !activeBasket.cep_stock || activeBasket.cep_stock.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center opacity-70">No stocks in this basket</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketPickerModal;


