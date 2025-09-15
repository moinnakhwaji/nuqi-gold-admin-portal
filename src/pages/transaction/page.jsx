import React, { useState, useEffect } from "react";
import {
  Header,
  ExportCSVButton,
  Pagination,
  EmptyState,
  SortableTableHeader,
} from "../../components";
import SearchBox from "../../components/SearchBox";
import { useStateContext } from "../../contexts/ContextProvider";
import { useGetTransactionsQuery, useLazyExportTransactionsQuery } from "../../redux/slices/Transaction/TransactionApi";
import { ChevronUp, ChevronDown, Calendar, X } from "lucide-react";

const CustomDatePicker = ({ selected, onChange, placeholder, disabled = false, minDate, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB');
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push(currentDate);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const selectDate = (date) => {
    if (disabled) return;
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;
    
    onChange(date);
    setIsOpen(false);
  };

  const clearDate = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const isDateDisabled = (date) => {
    if (!date) return false;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSelectedDate = (date) => {
    if (!selected || !date) return false;
    return selected.toDateString() === date.toDateString();
  };

  return (
    <div className="relative">
      <div
        className={`w-48 px-4 py-3 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-300 cursor-pointer flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected ? formatDate(selected) : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selected && (
            <X 
              size={16} 
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={clearDate}
            />
          )}
          <Calendar size={16} className="text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4 min-w-[300px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-gray-900 font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-gray-500 p-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="w-8 h-8 flex items-center justify-center">
                {date && (
                  <button
                    onClick={() => selectDate(date)}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full rounded-full text-sm flex items-center justify-center transition-colors
                      ${isSelectedDate(date) 
                        ? 'bg-blue-600 text-white' 
                        : isDateDisabled(date)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [clientSideFilteredData, setClientSideFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { currentMode } = useStateContext();

  // Redux query for fetching transactions
  const {
    data: transactionsResponse,
    error,
    isLoading,
    refetch
  } = useGetTransactionsQuery({
    page: currentPage,
    search: debouncedSearchTerm,
    limit: 10
  });

  // Redux query for CSV export
  const [exportTransactions, { isLoading: isExporting }] = useLazyExportTransactionsQuery();

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "success", label: "Success" },
    { value: "received", label: "Received" },
    { value: "sent", label: "Sent" },
    { value: "failed", label: "Failed" },
    { value: "under_review", label: "Under Review" },
    { value: "declined", label: "Declined" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const statusColorMap = {
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    under_review: "bg-yellow-100 text-yellow-800",
    sent: "bg-gray-100 text-gray-800",
    declined: "bg-red-100 text-red-800",
    received: "bg-purple-100 text-purple-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusTextMap = {
    success: "Success",
    failed: "Failed",
    under_review: "Under Review",
    sent: "Sent",
    declined: "Declined",
    received: "Received",
    cancelled: "Cancelled",
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Apply client-side filters (status, date range, sorting)
  useEffect(() => {
    if (!transactionsResponse?.data) {
      setClientSideFilteredData([]);
      return;
    }

    let filtered = [...transactionsResponse.data];

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply date range filter
    if (startDate || endDate) {
      filtered = filtered.filter((item) => {
        const transactionDate = new Date(item.createdAt);

        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);

          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);

          return transactionDate >= start && transactionDate <= end;
        } else if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          return transactionDate >= start;
        } else if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return transactionDate <= end;
        }

        return true;
      });
    }

    // Apply sorting
    if (sortField) {
      filtered = filtered.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        if (valueA === null || valueA === undefined) valueA = "";
        if (valueB === null || valueB === undefined) valueB = "";

        if (sortField === "amount") {
          valueA = parseFloat(valueA) || 0;
          valueB = parseFloat(valueB) || 0;
        } else if (sortField === "createdAt") {
          valueA = valueA ? new Date(valueA).getTime() : 0;
          valueB = valueB ? new Date(valueB).getTime() : 0;
        } else if (typeof valueA === "string" && typeof valueB === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        }
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      });
    }

    setClientSideFilteredData(filtered);
  }, [transactionsResponse?.data, statusFilter, startDate, endDate, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

const handleExportCSV = async () => {
  try {
    const result = await exportTransactions({
      search: debouncedSearchTerm,
      export: 'csv'
    });

    if (result.data) {
      // Create blob and download
      const blob = new Blob([result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const date = new Date().toISOString().slice(0, 10);
      link.download = `transactions-records-${date}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Export failed:', error);
    // You might want to show a toast/notification here
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("en-GB");
    } catch (e) {
      return dateString;
    }
  };

  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  // Get data for status filter counts (from original data, not filtered)
  const getStatusCount = (statusValue) => {
    if (!transactionsResponse?.data) return 0;
    if (statusValue === "all") return transactionsResponse.data.length;
    return transactionsResponse.data.filter(
      (item) => item.status?.toLowerCase() === statusValue
    ).length;
  };

  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Transactions Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div
            className={`animate-spin rounded-full h-32 w-32 border-b-2 ${
              currentMode === "Dark" ? "border-cyan-400" : "border-blue-600"
            }`}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Transactions Dashboard" />
        <EmptyState
          title="Error Loading Transactions"
          message="Unable to fetch transactions data. Please try again."
          iconType="document"
          showRefreshButton
          buttonText="Retry"
          onButtonClick={() => refetch()}
        />
      </div>
    );
  }

  if (!transactionsResponse?.data || transactionsResponse.data.length === 0) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Transactions Dashboard" />
        <EmptyState
          title="No Transactions Found"
          message="Transactions will appear here once they are available."
          iconType="document"
        />
      </div>
    );
  }

  return (
    <div
      className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
        currentMode === "Dark"
          ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
          : "bg-white shadow-lg"
      }`}
    >
      <Header category="Page" title="Transactions Dashboard" />

      {/* Search Box and Export Button */}
      <div className="mb-4 flex items-center justify-between">
        <SearchBox
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Transaction ID, User ID, etc"
        />
      <button
  onClick={handleExportCSV}
  disabled={isExporting}
  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
    isExporting
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : currentMode === 'Dark'
      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  }`}
>
  {isExporting ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      Exporting...
    </>
  ) : (
    <>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export CSV
    </>
  )}
</button>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className={`border-b ${currentMode === "Dark" ? "border-gray-600" : "border-gray-200"}`}>
          <div className="flex gap-6 overflow-x-auto pb-0">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  statusFilter === status.value
                    ? currentMode === "Dark"
                      ? 'text-cyan-400 border-cyan-400'
                      : 'text-blue-600 border-blue-600'
                    : currentMode === "Dark"
                    ? 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status.label} ({getStatusCount(status.value)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="mb-6 flex gap-4">
        <CustomDatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholder="Start Date"
          maxDate={new Date()}
        />
        <CustomDatePicker
          selected={endDate}
          onChange={setEndDate}
          placeholder="End Date"
          minDate={startDate}
          maxDate={new Date()}
          disabled={!startDate}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className={`min-w-full border ${
            currentMode === "Dark"
              ? "bg-transparent border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <thead
            className={currentMode === "Dark" ? "bg-transparent" : "bg-gray-50"}
          >
            <tr>
              <SortableTableHeader
                field="transaction_id"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Transaction ID
              </SortableTableHeader>
              <SortableTableHeader
                field="user_id"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                User ID
              </SortableTableHeader>
              <SortableTableHeader
                field="amount"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Amount
              </SortableTableHeader>
              <SortableTableHeader
                field="type"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Type
              </SortableTableHeader>
              <SortableTableHeader
                field="transaction_type"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Transaction Type
              </SortableTableHeader>
              <SortableTableHeader
                field="status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Status
              </SortableTableHeader>
              <SortableTableHeader
                field="createdAt"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Date
              </SortableTableHeader>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              currentMode === "Dark"
                ? "bg-transparent divide-gray-800"
                : "bg-white divide-gray-200"
            }`}
          >
            {clientSideFilteredData.map((transaction, index) => (
              <tr key={transaction.transaction_id || index} className={getRowBackgroundClass(index)}>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    currentMode === "Dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {transaction.transaction_id}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {transaction.user_id || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {transaction.amount || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {transaction.type || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {transaction.transaction_type || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      statusColorMap[transaction.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusTextMap[transaction.status] || transaction.status}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDate(transaction.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={transactionsResponse?.currentPage || currentPage}
        totalPages={transactionsResponse?.totalPages || 1}
        onPageChange={handlePageChange}
        totalRecords={transactionsResponse?.totalRecords || 0}
        backendLimit={transactionsResponse?.limit || 10}
        recordsCount={clientSideFilteredData.length}
      />

      {/* No Records Message for filtered results */}
      {clientSideFilteredData.length === 0 && transactionsResponse?.data?.length > 0 && (
        <EmptyState
          title="No Transactions Found"
          message="No transactions match your current filters. Try adjusting your search criteria."
          iconType="document"
          showRefreshButton
          buttonText="Clear Filters"
          onButtonClick={() => {
            setStatusFilter("all");
            setStartDate(null);
            setEndDate(null);
            setSearchTerm("");
          }}
          className="py-16"
        />
      )}
    </div>
  );
};

export default TransactionsPage;