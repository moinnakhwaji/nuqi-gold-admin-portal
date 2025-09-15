import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const CepStockTable = ({ selectedBasket, onVolumeChange, onRemove, removing }) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  return (
    <div className={`mt-5 ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60 rounded-md p-4" : ""}`}>
      <h3 className="text-xl font-bold mb-3">Stocks in Basket</h3>
      <table className={`w-full ${isDark ? "" : "bg-white"}`}>
        <thead>
          <tr className={`${isDark ? "bg-black/30" : "bg-gray-100"}`}>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Symbol</th>
            <th className="p-3 text-left">Exchange</th>
            <th className="p-3 text-left">Volume</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(selectedBasket.cep_stock || []).map((stock) => (
            <tr key={stock.stock_id} className="border-b border-gray-700">
              <td className="p-3">{stock.stock?.name}</td>
              <td className="p-3">{stock.stock?.symbol}</td>
              <td className="p-3">{stock.stock?.exchange}</td>
              <td className="p-3">
                <input
                  type="number"
                  value={stock.volume}
                  onChange={(e) => onVolumeChange(stock.stock_id, e.target.value)}
                  className={`p-1 rounded-md w-24 ${isDark ? "bg-black/30 text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`}
                />
              </td>
              <td className="p-3">
                <button
                  type="button"
                  disabled={removing}
                  onClick={() => onRemove(stock.stock_id)}
                  className={`p-2 px-4 text-white rounded-md ${removing ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CepStockTable;


