import React, { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";

const TransactionTable = ({ transactions, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const transactionsPerPage = 10;

  const totalPages =
    Math.ceil((transactions?.length || 0) / transactionsPerPage) || 1;
  const currentTransactions = (transactions || []).slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Column sizes are controlled via grid template on the header/rows

  return (
    <div className="mt-4 text-center text-white h-[70vh] overflow-y-auto overflow-x-auto w-full px-4">
      <div className="min-w-[1000px]">
        <div className="w-full grid grid-cols-[24px,180px,100px,80px,1fr,90px,70px,110px,60px,140px] items-center text-sm py-2 bg-[#0B1120] sticky top-0 z-10 px-2">
          <div />
          <div className="font-semibold whitespace-nowrap">Date & Time</div>
          <div className="font-semibold text-center">Transaction</div>
          <div className="font-semibold text-center">Type</div>
          <div className="font-semibold">Name</div>
          <div className="font-semibold text-center">Exchange</div>
          <div className="font-semibold text-center">Status</div>
          <div className="font-semibold text-right">Trade Price</div>
          <div className="font-semibold text-center">Qty</div>
          <div className="font-semibold text-right whitespace-nowrap">
            Transaction Amount
          </div>
        </div>

        {currentTransactions.length > 0 ? (
          currentTransactions.map((txn) => (
            <div key={txn.id} className="w-full text-sm my-2 rounded-lg">
              <div className="grid grid-cols-[24px,180px,100px,80px,1fr,90px,70px,110px,60px,140px] items-center px-3 py-2 rounded-lg border border-gray-800/40 bg-black/20 hover:bg-white/5 transition-colors">
                <div
                  className="cursor-pointer flex justify-center"
                  onClick={() => txn.asset === "CEP" && toggleRow(txn.id)}
                >
                  {txn.asset === "CEP" &&
                    (expandedRow === txn.id ? (
                      <FaMinusCircle />
                    ) : (
                      <FaPlusCircle />
                    ))}
                </div>
                <div className="whitespace-nowrap">
                  {new Date(txn.updated_at).toLocaleString()}
                </div>
                <div
                  className={`${
                    txn.transaction_type === "BUY"
                      ? "text-green-500"
                      : "text-red-500"
                  } text-center`}
                >
                  {txn.transaction_type}
                </div>
                <div className="text-center">{txn.asset}</div>
                <div className="truncate">
                  {txn.stock?.name || txn.cep?.cep_name || "-"}
                </div>
                <div className="text-center">{txn.stock?.exchange || "-"}</div>
                <div className="flex justify-center items-center">
                  {txn.status === "COMPLETED" && (
                    <FaCheckCircle color="#22c55e" size={15} />
                  )}
                  {txn.status === "PENDING" && (
                    <FaExclamationCircle color="#eab308" size={15} />
                  )}
                  {txn.status === "FAILED" && (
                    <FaTimesCircle color="#ef4444" size={15} />
                  )}
                </div>
                <div className="text-right">{txn.trade_price || "NA"}</div>
                <div className="text-center">{txn.quantity}</div>
                <div className="text-right tabular-nums whitespace-nowrap">
                  {Number(txn.total_price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              {expandedRow === txn.id && txn.subtransactions?.length > 0 && (
                <div className="mt-2 mx-auto w-full px-6 flex flex-col text-xs text-white border-y border-gray-800 py-3 rounded-md bg-white/5">
                  <div className="flex text-cyan-400 font-semibold items-center justify-center">
                    <div className="w-40 flex justify-center items-center">
                      Date
                    </div>
                    <div className="w-32 flex justify-center items-center">
                      Time
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                      Name
                    </div>
                    <div className="w-32 flex justify-center items-center">
                      Exchange
                    </div>
                    <div className="w-28 flex justify-center items-center">
                      Status
                    </div>
                    <div className="w-32 flex justify-center items-center">
                      Trade Price
                    </div>
                    <div className="w-24 flex justify-center items-center">
                      Shares
                    </div>
                    <div className="w-44 flex justify-center items-center">
                      Total Value (USD)
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    {txn.subtransactions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex py-2 items-center justify-center border-t border-gray-900 first:border-0"
                      >
                        <div className="w-40 flex justify-center items-center">
                          {new Date(sub.updated_at).toLocaleDateString()}
                        </div>
                        <div className="w-32 flex justify-center items-center">
                          {new Date(sub.updated_at).toLocaleTimeString()}
                        </div>
                        <div className="flex-1 flex justify-center items-center">
                          {sub.stock?.name}
                        </div>
                        <div className="w-32 flex justify-center items-center">
                          {sub.stock?.exchange}
                        </div>
                        <div className="w-28 flex justify-center items-center">
                          {sub.status === "COMPLETED" && (
                            <FaCheckCircle color="#22c55e" size={15} />
                          )}
                          {sub.status === "PENDING" && (
                            <FaExclamationCircle color="#eab308" size={15} />
                          )}
                          {sub.status === "FAILED" && (
                            <FaTimesCircle color="#ef4444" size={15} />
                          )}
                        </div>
                        <div className="w-32 flex justify-center items-center text-zinc-400">
                          {sub?.Order?.[0]?.price
                            ? `USD ${Number(sub.Order[0].price).toFixed(2)}`
                            : "-"}
                        </div>
                        <div className="w-24 flex justify-center items-center">
                          {sub.quantity}
                        </div>
                        <div className="w-44 flex justify-center items-center text-zinc-400 tabular-nums">
                          {sub?.Order?.[0]?.price_net_settle &&
                          sub?.Order?.[0]?.quantity ? (
                            <>
                              USD{" "}
                              {Number(
                                sub.Order[0].price_net_settle *
                                  sub.Order[0].quantity
                              ).toFixed(2)}
                            </>
                          ) : (
                            "-"
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
                <div className="text-cyan-400 font-medium">
                  Loading transactions...
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg
                  className="w-16 h-16 text-gray-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <div className="text-lg font-medium text-gray-500">
                  No Transactions Available
                </div>
                <div className="text-sm text-gray-600">
                  No transaction data found for this user.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {(transactions?.length || 0) > transactionsPerPage && (
        <div className="flex justify-center items-center mt-4">
          <button
            type="button"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mx-2 px-3 py-1 bg-customGray text-white rounded ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
          >
            Prev
          </button>
          <span className="text-white mx-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-2 px-3 py-1 bg-customGray text-white rounded ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
