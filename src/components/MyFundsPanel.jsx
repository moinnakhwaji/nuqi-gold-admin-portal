import React from "react";
import { useGetCashDetailsQuery } from "../redux/slices/allusers/allusersApi";
import { useStateContext } from "../contexts/ContextProvider";

const MyFundsPanel = ({ userId }) => {
  const { currentMode } = useStateContext();
  const { data, isLoading, error } = useGetCashDetailsQuery({ userId }, { skip: !userId });
  const cashDetails = data?.data || [];

  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100"
      : "bg-white";
  const borderClass = currentMode === "Dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`rounded-2xl w-full ${containerBg} border ${borderClass} shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b dark:border-gray-800 border-gray-200">
        <h2 className="text-xl font-semibold">My Funds</h2>
      </div>

      {/* Content */}
      <div className="px-6 pt-4 pb-6 space-y-3">
        {isLoading && (
          <div className="text-sm text-gray-400">Loading balances...</div>
        )}
        {error && (
          <div className="text-sm text-red-400">Could not load balances.</div>
        )}
        {!isLoading && !error && cashDetails.length === 0 && (
          <div className="text-sm text-gray-400">No fund balances available.</div>
        )}
        {cashDetails.map((value, i) => {
          const available = Number(value?.cashAvailableForWithdraw || 0).toFixed(4);
          const title = `Available Withdrawal Amount: ${value?.currency} ${available}`;
          return (
            <div
              key={`${value?.currency || "cur"}-${i}`}
              className={`flex justify-between items-center px-4 py-3 rounded-xl ${
                currentMode === "Dark"
                  ? "bg-slate-900/40 border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
              title={title}
            >
              <div className="flex items-center">
                <span className="text-md font-semibold min-w-[44px]">{value?.currency}</span>
                <span className="ml-2 text-md">
                  {Number(value?.balance || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <span className="flex items-center">
                {value?.fx?.image_url ? (
                  <img
                    src={value?.fx?.image_url}
                    alt={value?.currency}
                    className="ml-2 w-7 h-7 object-cover rounded-full"
                  />
                ) : (
                  <span className="ml-2 w-7 h-7 rounded-full bg-slate-700 inline-block" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyFundsPanel;
