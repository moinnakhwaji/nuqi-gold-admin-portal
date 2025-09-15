import React, { useMemo, useState } from "react";
import {
  useGetStocksQuery,
  useSaveStockMutation,
  useDeleteStockMutation,
} from "../../redux/slices/stockmanager/stocksApi";
import {
  Header,
  EmptyState,
  ExchangePickerModal,
  SortableTableHeader,
} from "../../components";
import SearchBox from "../../components/SearchBox";
import { useStateContext } from "../../contexts/ContextProvider";

const initialForm = {
  id: "",
  name: "",
  isin: "",
  exchange: "",
  symbol: "",
  currency: "",
  last_price: "",
  market_cap: "",
  description: "",
  key: "",
  is_active: false,
};

const StocksManagerPage = () => {
  const { currentMode } = useStateContext();
  const { data, isLoading, error } = useGetStocksQuery();
  const [saveStock, { isLoading: isSaving }] = useSaveStockMutation();
  const [deleteStock, { isLoading: isDeleting }] = useDeleteStockMutation();

  const stocks = data?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExchange, setSelectedExchange] = useState("");
  const [exchangePickerOpen, setExchangePickerOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filtered and sorted list
  const filteredStocks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = stocks;
    if (term) {
      list = list.filter(
        (s) =>
          s?.name?.toLowerCase().includes(term) ||
          s?.symbol?.toLowerCase().includes(term) ||
          s?.isin?.toLowerCase().includes(term)
      );
    }
    if (selectedExchange) {
      list = list.filter((s) => String(s?.exchange) === selectedExchange);
    }

    // Apply sorting
    if (sortField) {
      list = [...list].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle numeric fields
        if (sortField === "last_price" || sortField === "market_cap") {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else {
          // Handle string fields
          aValue = String(aValue || "").toLowerCase();
          bValue = String(bValue || "").toLowerCase();
        }

        if (sortDirection === "asc") {
          if (aValue > bValue) return 1;
          if (aValue < bValue) return -1;
          return 0;
        }
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      });
    }

    return list;
  }, [stocks, searchTerm, selectedExchange, sortField, sortDirection]);

  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
      : "bg-white shadow-lg";

  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black hover:bg-slate-800/30";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (stock) => {
    setFormData({
      id: stock?.id ?? "",
      name: stock?.name ?? "",
      isin: stock?.isin ?? "",
      exchange: stock?.exchange ?? "",
      symbol: stock?.symbol ?? "",
      currency: stock?.currency ?? "",
      last_price: stock?.last_price ?? "",
      market_cap: stock?.market_cap ?? "",
      description: stock?.description ?? "",
      key: stock?.key ?? "",
      is_active: !!stock?.is_active,
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveStock(formData).unwrap();
      resetForm();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save stock", err);
    }
  };

  const handleDelete = async (id) => {
    // Use native confirm but suppress lint via comment to keep UX simple
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      "Are you sure you want to delete this stock?"
    );
    if (!confirmed) return;
    try {
      await deleteStock({ id }).unwrap();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete stock", err);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${containerBg}`}
      >
        <Header category="Page" title="Stocks Manager" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${containerBg}`}
      >
        <Header category="Page" title="Stocks Manager" />
        <EmptyState
          variant="error"
          title="Unable to Load Stocks"
          message="We encountered an issue while loading the stocks. Please try again."
          buttonText="Refresh Page"
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${containerBg}`}
      >
        <Header category="Page" title="Stocks Manager" />

        <div className="flex justify-between items-center mb-5">
          <SearchBox
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, symbol, or ISIN..."
          />
          {!showForm && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setExchangePickerOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                View All Exchanges
              </button>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Stock
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {formData.id ? "Edit Stock" : "Add Stock"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Name", type: "text" },
                { name: "isin", label: "ISIN", type: "text" },
                { name: "exchange", label: "Exchange", type: "text" },
                { name: "symbol", label: "Symbol", type: "text" },
                { name: "currency", label: "Currency", type: "text" },
                {
                  name: "last_price",
                  label: "Last Price",
                  type: "number",
                  step: "0.01",
                },
                {
                  name: "market_cap",
                  label: "Market Cap",
                  type: "number",
                  step: "0.01",
                },
                { name: "key", label: "Key", type: "text" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    step={f.step}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-2 rounded-md border ${
                      currentMode === "Dark"
                        ? "bg-transparent border-gray-700 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-md min-h-[60px] border ${
                    currentMode === "Dark"
                      ? "bg-transparent border-gray-700 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Is Active
                </label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="scale-125"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={isSaving}
                className={`inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg shadow-lg transition-all duration-200 ${
                  isSaving
                    ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105"
                } text-white`}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {formData.id ? "Update Stock" : "Add Stock"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className={`min-w-max border ${
              currentMode === "Dark"
                ? "bg-transparent border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            <thead
              className={
                currentMode === "Dark" ? "bg-transparent" : "bg-gray-50"
              }
            >
              <tr>
                <SortableTableHeader
                  field="name"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Name
                </SortableTableHeader>
                <SortableTableHeader
                  field="isin"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  ISIN
                </SortableTableHeader>
                <SortableTableHeader
                  field="exchange"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Exchange
                </SortableTableHeader>
                <SortableTableHeader
                  field="symbol"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Symbol
                </SortableTableHeader>
                <SortableTableHeader
                  field="currency"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Currency
                </SortableTableHeader>
                <SortableTableHeader
                  field="last_price"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Last Price
                </SortableTableHeader>
                <SortableTableHeader
                  field="market_cap"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Market Cap
                </SortableTableHeader>
                <SortableTableHeader
                  field="key"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Key
                </SortableTableHeader>
                <SortableTableHeader
                  field="is_active"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Is Active
                </SortableTableHeader>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b ${
                    currentMode === "Dark"
                      ? "text-cyan-400 border-gray-700"
                      : "text-gray-500 border-gray-300"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                currentMode === "Dark"
                  ? "bg-transparent divide-gray-800"
                  : "bg-white divide-gray-200"
              }`}
            >
              {filteredStocks.map((stock, index) => (
                <tr key={stock.id} className={getRowBackgroundClass(index)}>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stock.name}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.isin}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.exchange}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.symbol}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.currency}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.last_price}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.market_cap}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.key}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stock.is_active ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(stock)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(stock.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md shadow-md transition-all duration-150 ${
                          isDeleting
                            ? "bg-gradient-to-r from-red-400 to-red-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105"
                        } text-white`}
                      >
                        {isDeleting ? (
                          <>
                            <svg
                              className="w-3 h-3 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ExchangePickerModal
        isOpen={exchangePickerOpen}
        onClose={() => setExchangePickerOpen(false)}
        exchanges={[...new Set(stocks.map((s) => s.exchange))]}
        onSelect={(ex) => setSelectedExchange(ex)}
      />
    </>
  );
};

export default StocksManagerPage;
