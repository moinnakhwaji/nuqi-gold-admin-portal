import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserTransactionsQuery } from "../../redux/slices/allusers/allusersApi";
import TransactionTable from "../../components/portfolio/TransactionTable";
import AdvancedFilters from "../../components/portfolio/AdvancedFilters";

const TransactionsPage = () => {
  const { userId } = useParams();

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [method] = useState("STOCKS");
  const [fromDate] = useState("");
  const [toDate] = useState("");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const { data, isFetching } = useGetUserTransactionsQuery(
    {
      userId,
      type: "ALL",
      method,
      from_date: fromDate,
      to_date: toDate,
      sector: "",
      exchange: "",
      order: "",
      orderstatus: "",
      search: "",
    },
    { skip: !userId }
  );

  useEffect(() => {
    if (data) {
      setFilteredTransactions(data?.transactions || []);
    }
  }, [data]);

  // Placeholder for future search integration

  return (
    <div className="p-6 text-gray-100">
      <div className="rounded-2xl border border-gray-700/60 shadow-xl bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="px-6 py-4 border-b border-gray-700/60 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Transactions for User: {userId}
          </h1>
          <div className="text-sm text-cyan-400">
            {isFetching ? "Loading..." : null}
          </div>
        </div>

        <div className="px-6 py-4">
          {/* Filters header (optional controls can be added later) */}
          {/* Example placeholders for future controls */}
          {/* <div className="flex gap-2 mb-4">
            <button className="px-3 py-1 rounded-full text-xs border border-gray-700/60">{method}</button>
          </div> */}

          <TransactionTable
            transactions={filteredTransactions}
            isLoading={isFetching}
          />
        </div>
      </div>

      {isAdvancedFilterOpen && (
        <AdvancedFilters
          isOpen={isAdvancedFilterOpen}
          onClose={() => setIsAdvancedFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
