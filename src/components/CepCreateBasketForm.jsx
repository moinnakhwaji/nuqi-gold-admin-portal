import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import FancyCheckbox from "./FancyCheckbox";

const CepCreateBasketForm = ({ newBasket, onChange, onSubmit, isSubmitting }) => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === "Dark";
  return (
    <div className={`mb-10 p-5 rounded-md ${isDark ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60" : "bg-white"}`}>
      <h2 className="text-xl font-bold mb-3">Create New CEP Basket</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Basket Name"
          className={`p-2 rounded ${isDark ? "bg-black/30 text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`}
          value={newBasket.cep_name}
          onChange={(e) => onChange({ ...newBasket, cep_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Graph Lock Period"
          className={`p-2 rounded ${isDark ? "bg-black/30 text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`}
          value={newBasket.graph_lock_period}
          onChange={(e) => onChange({ ...newBasket, graph_lock_period: e.target.value })}
        />
        <textarea
          placeholder="Methodologies"
          className={`p-2 rounded col-span-2 ${isDark ? "bg-black/30 text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`}
          value={newBasket.methodologies}
          onChange={(e) => onChange({ ...newBasket, methodologies: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className={`p-2 rounded col-span-2 ${isDark ? "bg-black/30 text-white border border-gray-700/60" : "bg-white text-gray-900 border border-gray-300"}`}
          value={newBasket.description}
          onChange={(e) => onChange({ ...newBasket, description: e.target.value })}
        />
        <div className="flex items-center gap-2 flex-wrap col-span-2">
          <FancyCheckbox
            label="Conservative"
            checked={newBasket.is_conservative}
            onChange={(val) => onChange({ ...newBasket, is_conservative: val })}
            name="is_conservative"
          />
          <FancyCheckbox
            label="Balanced"
            checked={newBasket.is_balanced}
            onChange={(val) => onChange({ ...newBasket, is_balanced: val })}
            name="is_balanced"
          />
          <FancyCheckbox
            label="Growth"
            checked={newBasket.is_growth}
            onChange={(val) => onChange({ ...newBasket, is_growth: val })}
            name="is_growth"
          />
          <FancyCheckbox
            label="Aggressive"
            checked={newBasket.is_aggressive}
            onChange={(val) => onChange({ ...newBasket, is_aggressive: val })}
            name="is_aggressive"
          />
          <FancyCheckbox
            label="Active"
            checked={newBasket.is_active}
            onChange={(val) => onChange({ ...newBasket, is_active: val })}
            name="is_active"
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`col-span-2 p-2 px-4 text-white rounded ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSubmitting ? "Creating..." : "Create Basket"}
        </button>
      </div>
    </div>
  );
};

export default CepCreateBasketForm;


