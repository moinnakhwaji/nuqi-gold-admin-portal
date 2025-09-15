import React, { useMemo } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import GradientSelect from "./GradientSelect";

const CepStockAdder = ({
  stocks,
  searchTerm,
  setSearchTerm,
  selectedExchange,
  setSelectedExchange,
  newStockId,
  setNewStockId,
  volumeInput,
  setVolumeInput,
  marketCap,
  setMarketCap,
  marketcapWeight,
  setMarketcapWeight,
  basketWeight,
  setBasketWeight,
  onAdd,
  adding,
}) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";

  const filteredStocks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (stocks || []).filter((stock) => {
      const matchesSearch =
        String(stock.name || "").toLowerCase().includes(term) ||
        String(stock.symbol || "").toLowerCase().includes(term);
      const matchesExchange = selectedExchange ? stock.exchange === selectedExchange : true;
      return matchesSearch && matchesExchange;
    });
  }, [stocks, searchTerm, selectedExchange]);

  return (
    <div className={`flex flex-col gap-5 mt-5 p-6 rounded-md ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60" : "bg-white"}`}>
      <h3 className="text-2xl font-semibold text-white">Add Stock to Basket</h3>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col w-72">
          <label htmlFor="stockSearch" className="text-sm font-medium text-gray-300 mb-1">Search Stocks</label>
          <input id="stockSearch" type="text" placeholder="Search by name or symbol..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`p-3 rounded focus:outline-none ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`} />
        </div>
        <div className="flex flex-col w-72">
          <label className="text-sm font-medium text-gray-300 mb-1">Select Exchange</label>
          <GradientSelect
            value={selectedExchange}
            onChange={(val) => setSelectedExchange(val)}
            placeholder="All Exchanges"
            options={[{ value: "", label: "All Exchanges" }, ...[...new Set((stocks || []).map((s) => s.exchange))].map((ex) => ({ value: ex, label: ex }))]}
            widthClass="w-72"
          />
        </div>
        <div className="flex flex-col w-72">
          <label className="text-sm font-medium text-gray-300 mb-1">Select Stock</label>
          <GradientSelect
            value={newStockId}
            onChange={(val) => setNewStockId(val)}
            placeholder="Select a Stock"
            options={[{ value: "", label: "-- Select a Stock --" }, ...filteredStocks.map((s) => ({ value: s.id, label: `${s.name} (${s.symbol})` }))]}
            widthClass="w-72"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col w-72">
          <label htmlFor="volumeInput" className="text-sm font-medium text-gray-300 mb-1">Volume</label>
          <input id="volumeInput" type="number" placeholder="Enter volume..." value={volumeInput} onChange={(e) => setVolumeInput(e.target.value)} className={`p-3 rounded focus:outline-none ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`} />
        </div>
        <div className="flex flex-col w-72">
          <label htmlFor="marketCap" className="text-sm font-medium text-gray-300 mb-1">Market Cap</label>
          <input id="marketCap" type="number" placeholder="Enter market cap..." value={marketCap} onChange={(e) => setMarketCap(e.target.value)} className={`p-3 rounded focus:outline-none ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`} />
        </div>
        <div className="flex flex-col w-72">
          <label htmlFor="marketCapWeight" className="text-sm font-medium text-gray-300 mb-1">Market Cap Weight</label>
          <input id="marketCapWeight" type="number" placeholder="Enter market cap weight..." value={marketcapWeight} onChange={(e) => setMarketcapWeight(e.target.value)} className={`p-3 rounded focus:outline-none ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`} />
        </div>
        <div className="flex flex-col w-72">
          <label htmlFor="basketWeight" className="text-sm font-medium text-gray-300 mb-1">Basket Weight</label>
          <input id="basketWeight" type="number" placeholder="Enter basket weight..." value={basketWeight} onChange={(e) => setBasketWeight(e.target.value)} className={`p-3 rounded focus:outline-none ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`} />
        </div>
      </div>

      <button type="button" onClick={onAdd} disabled={adding} className={`w-full py-3 mt-2 text-white rounded-md ${adding ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}>
        {adding ? "Adding..." : "Add Stock"}
      </button>
    </div>
  );
};

export default CepStockAdder;


