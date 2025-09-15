import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const AdvancedFilters = ({ isOpen, onClose }) => {
  // Future placeholders (sector/exchange) removed to avoid unused-vars until wired
  const [orderType, setOrderType] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("ALL");

  const type = ["Market", "Limit", "Stop Loss"];
  const transactionTypes = ["ALL", "BUY", "SELL"];
  const transactionStatusData = ["COMPLETED", "PENDING", "FAILED"];

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleClearAllFilters = () => {
    setOrderType("");
    setTransactionStatus("");
    setSelectedTransactionType("ALL");
  };

  const getTxnTypeClass = (t) => {
    if (selectedTransactionType !== t) {
      return "text-gray-300 border border-gray-600";
    }
    if (t === "ALL") return "bg-cyan-400 text-black";
    if (t === "BUY") return "bg-green-600 text-white";
    return "bg-red-500 text-white";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-gradient-to-br from-black via-slate-900 to-black border border-gray-700/60 p-8 rounded-3xl max-w-3xl w-full overflow-y-auto h-[80vh] text-gray-100 shadow-xl">
        <button type="button" onClick={onClose} className="text-cyan-400 float-right font-extralight text-3xl">
          <AiOutlineClose size={25} className="text-cyan-400" />
        </button>
        <div className="text-xl font-medium text-cyan-400 mb-4">Advanced Filters</div>

        <div className="font-semibold text-white mb-4">Transaction Type</div>
        <div className="flex gap-4 flex-wrap">
          {transactionTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTransactionType(t)}
              className={`px-5 py-2 rounded-3xl text-xs ${getTxnTypeClass(t)}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="font-semibold text-white mb-4 mt-6">Order type</div>
        <div className="flex gap-4 flex-wrap">
          {type.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setOrderType(t)}
              className={`px-5 py-2 rounded-3xl text-xs border border-gray-600 ${
                orderType === t ? "bg-cyan-400 text-black" : "text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="font-semibold text-white mb-4 mt-6">Order status</div>
        <div className="flex gap-4 flex-wrap">
          {transactionStatusData.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setTransactionStatus(status)}
              className={`px-5 py-2 rounded-3xl text-xs border border-gray-600 ${
                transactionStatus === status ? "bg-cyan-400 text-black" : "text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-4 my-6">
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="px-6 py-2 border border-gray-600 text-cyan-400 rounded-3xl hover:bg-gray-800"
          >
            Clear All Filters
          </button>
          <button type="button" onClick={onClose} className="px-6 py-2 bg-cyan-400 text-black rounded-3xl font-semibold hover:bg-cyan-500">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;


