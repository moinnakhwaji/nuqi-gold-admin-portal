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
import { Calendar, X } from "lucide-react";

// This custom component remains unchanged as its logic is self-contained.
const CustomDatePicker = ({ selected, onChange, placeholder, disabled = false, minDate, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  useEffect(() => {
    if (selected) {
      setCurrentMonth(selected);
    }
  }, [selected]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() -1; // Monday first

    const days = Array(startingDayOfWeek).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
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
    const isBeforeMin = minDate && date < new Date(minDate.setHours(0, 0, 0, 0));
    const isAfterMax = maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999));
    if (isBeforeMin || isAfterMax) return;
    
    onChange(date);
    setIsOpen(false);
  };

  const clearDate = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const isDateDisabled = (date) => {
    if (!date) return false;
    const isBeforeMin = minDate && date < new Date(minDate.setHours(0, 0, 0, 0));
    const isAfterMax = maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999));
    return isBeforeMin || isAfterMax;
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
            <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-gray-900 font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded">
               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="w-8 h-8 flex items-center justify-center">
                {date && (
                  <button
                    onClick={() => selectDate(date)}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full rounded-full text-sm flex items-center justify-center transition-colors
                      ${isSelectedDate(date) ? 'bg-blue-600 text-white' : isDateDisabled(date) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100'}`}
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { currentMode } = useStateContext();

  // Redux query now includes all filter, sort, and pagination parameters.
  // It automatically refetches data whenever any of these state variables change.
  const {
    data: transactionsResponse,
    error,
    isLoading,
    refetch
  } = useGetTransactionsQuery({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    status: statusFilter,
    startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
    endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
    sortField,
    sortDirection,
  });
  console.log("Transactions Response:", transactionsResponse);

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "success", label: "Success" },
    { value: "expired", label: "Expired" },
    { value: "pending", label: "Pending" },
    { value: "received", label: "Received" },
    { value: "sent", label: "Sent" },
    { value: "failed", label: "Failed" },
    // { value: "under_review", label: "Under Review" },
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
    pending: "bg-blue-100 text-blue-800",
  };

  const statusTextMap = {
    success: "Success",
    failed: "Failed",
    under_review: "Under Review",
    sent: "Sent",
    declined: "Declined",
    received: "Received",
    cancelled: "Cancelled",
    pending: "Pending",
  };

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // When any filter changes, reset to the first page
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, startDate, endDate]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Go to first page on sort change
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setStartDate(null);
    setEndDate(null);
    setSortField("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
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
  
  const mainContainerClass = `m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
      : "bg-white shadow-lg"
  }`;

  if (isLoading) {
    return (
      <div className={mainContainerClass}>
        <Header category="Page" title="Transactions Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-32 w-32 border-b-2 ${currentMode === "Dark" ? "border-cyan-400" : "border-blue-600"}`} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={mainContainerClass}>
        <Header category="Page" title="Transactions Dashboard" />
        <EmptyState
          title="Error Loading Transactions"
          message="Unable to fetch transactions data. Please try again."
          onButtonClick={() => refetch()}
          buttonText="Retry"
          showRefreshButton
        />
      </div>
    );
  }

  return (
    <div className={mainContainerClass}>
      <Header category="Page" title="Transactions Dashboard" />

      {/* Search and Export Section */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchBox
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by ID, amount, status..."
          className="flex-1 w-full sm:w-auto"
        />
       
         <ExportCSVButton
                   exportHook={useLazyExportTransactionsQuery}
                   currentFilters={{
                     search: debouncedSearchTerm,
                     status: statusFilter,
                     startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
                     endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
                     sortField,
                     sortDirection,
                   }}
                   filename="transactions.csv"
                   buttonText="Export to CSV"
                 />
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap -mb-px">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-medium ${
                statusFilter === status.value
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <CustomDatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholder="Start Date"
          maxDate={endDate || new Date()}
        />
        <CustomDatePicker
          selected={endDate}
          onChange={setEndDate}
          placeholder="End Date"
          minDate={startDate}
          maxDate={new Date()}
          disabled={!startDate}
        />
         <button 
           onClick={clearAllFilters}
           className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
         >
           Clear All Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`min-w-full border ${currentMode === "Dark" ? "bg-transparent border-gray-700" : "bg-white border-gray-300"}`}>
          <thead className={currentMode === "Dark" ? "bg-transparent" : "bg-gray-50"}>
            <tr>
              <SortableTableHeader field="transaction_id" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Trans. ID</SortableTableHeader>
              <SortableTableHeader field="user_id" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>User ID</SortableTableHeader>
              <SortableTableHeader field="amount" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Amount</SortableTableHeader>
              <SortableTableHeader field="type" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Type</SortableTableHeader>
              <SortableTableHeader field="transaction_type" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Trans. Type</SortableTableHeader>
              <SortableTableHeader field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Status</SortableTableHeader>
              <SortableTableHeader field="createdAt" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Date</SortableTableHeader>
            </tr>
          </thead>
          <tbody className={`divide-y ${currentMode === "Dark" ? "bg-transparent divide-gray-800" : "bg-white divide-gray-200"}`}>
            {transactionsResponse?.data?.length > 0 ? (
              transactionsResponse.data.map((transaction, index) => (
                <tr key={transaction.transaction_id || index} className={getRowBackgroundClass(index)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${currentMode === "Dark" ? "text-white" : "text-gray-900"}`}>{transaction.transaction_id}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentMode === "Dark" ? "text-white" : "text-gray-500"}`}>{transaction.user_id || "-"}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentMode === "Dark" ? "text-white" : "text-gray-500"}`}>{transaction.amount || "-"}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentMode === "Dark" ? "text-white" : "text-gray-500"}`}>{transaction.type || "-"}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentMode === "Dark" ? "text-white" : "text-gray-500"}`}>{transaction.transaction_type || "-"}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentMode === "Dark" ? "text-white" : "text-gray-500"}`}>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[transaction.status] || "bg-gray-100 text-gray-800"}`}>
                      {statusTextMap[transaction.status] || transaction.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentMode === "Dark" ? "text-white" : "text-gray-500"}`}>{formatDate(transaction.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12">
                  <EmptyState
                    title="No Transactions Found"
                    message="No transactions match your current filters. Try adjusting your search criteria."
                    showRefreshButton={true}
                    buttonText="Clear Filters"
                    onButtonClick={clearAllFilters}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={transactionsResponse?.currentPage || 1}
        totalPages={transactionsResponse?.totalPages || 1}
        onPageChange={handlePageChange}
        totalRecords={transactionsResponse?.totalRecords || 0}
      />
    </div>
  );
};

export default TransactionsPage;