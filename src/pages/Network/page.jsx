import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Header,
  Pagination,
  EmptyState,
  SortableTableHeader,
} from '../../components';
import SearchBox from '../../components/SearchBox';
import { useStateContext } from '../../contexts/ContextProvider';
import { useGetNetworkInfoQuery } from '../../redux/slices/network/networkApi';

const Network = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); 
  const [sortField, setSortField] = useState('createDateTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [cardTypeFilter, setCardTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { currentMode } = useStateContext();

  // RTK Query hook for fetching network info
  const { 
    data: networkData, 
    isLoading, 
    isFetching, 
    isSuccess, 
    isError, 
    error,
    refetch 
  } = useGetNetworkInfoQuery();

  // Process the data based on actual API response structure
  const processedData = React.useMemo(() => {
    if (isSuccess && networkData) {
      // Handle different possible response structures
      let transactionData = [];
      
      if (Array.isArray(networkData)) {
        // Direct array response
        transactionData = networkData;
      } else if (networkData.response?.data && Array.isArray(networkData.response.data)) {
        // Nested in response.data
        transactionData = networkData.response.data;
      } else if (networkData.data && Array.isArray(networkData.data)) {
        // Nested in data
        transactionData = networkData.data;
      } else if (networkData.success && networkData.data && Array.isArray(networkData.data)) {
        // Response with success flag
        transactionData = networkData.data;
      }

      return transactionData;
    }
    return [];
  }, [networkData, isSuccess]);

  // Show success/error toasts
  useEffect(() => {
    if (isSuccess && processedData.length > 0) {
      toast.success(`${processedData.length} network transactions loaded successfully!`);
    } else if (isError) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch network transactions';
      toast.error(errorMessage);
      console.error('Network API Error:', error);
    }
  }, [isSuccess, isError, error, processedData.length]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sort records function
  const sortRecords = (records, field, direction) =>
    [...records].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      if (field === "createDateTime" || field === "updateDateTime") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (field === "amount" || field === "value") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (typeof aValue === "string" && aValue !== "") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string" && bValue !== "") {
        bValue = bValue.toLowerCase();
      }

      if (direction === "asc") {
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
      }
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    });

  // Apply filters
  const applyFilters = (records) => {
    let filtered = [...records];

    // Apply card type filter
    if (cardTypeFilter !== "ALL") {
      filtered = filtered.filter(
        (item) => item?.cardType?.toUpperCase() === cardTypeFilter.toUpperCase()
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (item) => item?.state?.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    // Apply search term filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.transactionId?.toString().toLowerCase().includes(searchLower) ||
          item?.userId?.toString().toLowerCase().includes(searchLower) ||
          item?.cardholderName?.toString().toLowerCase().includes(searchLower) ||
          item?.cardName?.toString().toLowerCase().includes(searchLower) ||
          item?.ref_Id?.toString().toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredRecords = applyFilters(processedData);
  const sortedRecords = sortRecords(filteredRecords, sortField, sortDirection);

  // Pagination logic
  const recordsPerPage = 10;
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = sortedRecords.slice(startIndex, endIndex);

  // Event handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCardTypeChange = (e) => {
    setCardTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("en-GB");
    } catch (e) {
      return dateString;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Export to CSV function
  const exportToCSV = () => {
    if (!sortedRecords.length) {
      toast.warn('No data to export.');
      return;
    }

    const headers = [
      'Reference ID',
      'Transaction ID',
      'User ID',
      'Currency Code',
      'Issuing Organization',
      'Issuing Country',
      'Card Type',
      'Card Holder',
      'Card Name',
      'Amount',
      'Card Category',
      'Status',
      'Created At',
      'Updated At',
    ];

    const csvData = sortedRecords.map((item) => [
      item.ref_Id || '',
      item.transactionId || '',
      item.userId || '',
      item.currencyCode || '',
      item.issuingOrg || '',
      item.issuingCountry || '',
      item.cardType || '',
      item.cardholderName || '',
      item.cardName || '',
      item.amount || item.value || '',
      item.cardCategory || '',
      item.state || '',
      formatDate(item.createDateTime),
      formatDate(item.updateDateTime),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'network_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Network transactions exported successfully!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Network International Transactions" />
        <div className="flex items-center justify-center h-64">
          <div
            className={`animate-spin rounded-full h-32 w-32 border-b-2 ${
              currentMode === "Dark" ? "border-cyan-400" : "border-blue-600"
            }`}
          />
          <span className="ml-4 text-lg">Loading network transactions...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Network International Transactions" />
        <EmptyState
          title="Failed to Load Network Transactions"
          message={error?.data?.message || error?.message || "There was an error loading the network transactions. Please try again."}
          iconType="error"
          showRefreshButton
          buttonText="Retry"
          onButtonClick={handleRefresh}
        />
      </div>
    );
  }

  // Empty state
  if (processedData.length === 0) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Network International Transactions" />
        <EmptyState
          title="No Network Transactions Found"
          message="Network transactions will appear here once they are processed."
          iconType="document"
          showRefreshButton
          buttonText="Refresh Network Transactions"
          onButtonClick={handleRefresh}
        />
      </div>
    );
  }

  return (
    <div
      className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
        currentMode === "Dark"
          ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
          : "bg-white shadow-lg border-1 border-blue-300"
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Header category="Page" title="Network International Transactions" />

      {/* Search Box, Filters and Export Button */}
      <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <SearchBox
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Transaction ID, User ID, Card Holder, or Card Name"
            className="w-full sm:w-[400px]"
          />
          
          {/* Card Type Filter */}
          <div className="relative">
            <select
              value={cardTypeFilter}
              onChange={handleCardTypeChange}
              className={`px-4 py-3 rounded-lg focus:outline-none focus:ring-2 appearance-none pr-10 cursor-pointer ${
                currentMode === "Dark"
                  ? "bg-slate-800 border border-gray-600 text-white focus:ring-cyan-400"
                  : "bg-white border border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
            >
              <option value="ALL">All</option>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className={`px-4 py-3 rounded-lg focus:outline-none focus:ring-2 appearance-none pr-10 cursor-pointer ${
                currentMode === "Dark"
                  ? "bg-slate-800 border border-gray-600 text-white focus:ring-cyan-400"
                  : "bg-white border border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
            >
              <option value="ALL">All</option>
              <option value="PURCHASED">Purchased</option>
              <option value="FAILED">Failed</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            className={`px-6 py-2 flex items-center gap-2 rounded-lg transition-colors ${
              currentMode === "Dark"
                ? "bg-slate-800 hover:bg-slate-700 border border-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900"
            }`}
            disabled={isFetching}
          >
            <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
            <svg className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          <button
            onClick={exportToCSV}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentMode === "Dark"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
            disabled={isFetching}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Data Summary */}
      <div className="mb-4">
        <p className={`text-sm ${currentMode === "Dark" ? "text-gray-300" : "text-gray-600"}`}>
          Showing {currentRecords.length} of {sortedRecords.length} transactions
          {(searchTerm || cardTypeFilter !== "ALL" || statusFilter !== "ALL") && 
            ` (filtered from ${processedData.length} total)`
          }
        </p>
      </div>

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
            className={currentMode === "Dark" ? "bg-transparent" : "bg-gray-50"}
          >
            <tr>
              <SortableTableHeader
                field="ref_Id"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[120px]"
              >
                Reference ID
              </SortableTableHeader>
              <SortableTableHeader
                field="transactionId"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[120px]"
              >
                Trans. ID
              </SortableTableHeader>
              <SortableTableHeader
                field="userId"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[100px]"
              >
                User ID
              </SortableTableHeader>
              <SortableTableHeader
                field="currencyCode"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[80px]"
              >
                Currency 
              </SortableTableHeader>
              <SortableTableHeader
                field="issuingOrg"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[120px]"
              >
                Issuing Org
              </SortableTableHeader>
              <SortableTableHeader
                field="issuingCountry"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[130px]"
              >
                Issuing Country
              </SortableTableHeader>
              <SortableTableHeader
                field="cardType"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[100px]"
              >
                Card Type
              </SortableTableHeader>
              <SortableTableHeader
                field="cardholderName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[120px]"
              >
                Card Holder
              </SortableTableHeader>
              <SortableTableHeader
                field="cardName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[100px]"
              >
                Card Name
              </SortableTableHeader>
              <SortableTableHeader
                field="amount"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[100px]"
              >
                Amount
              </SortableTableHeader>
              <SortableTableHeader
                field="cardCategory"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[120px]"
              >
                Card Category
              </SortableTableHeader>
              <SortableTableHeader
                field="state"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[100px]"
              >
                Status
              </SortableTableHeader>
              <SortableTableHeader
                field="createDateTime"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[140px]"
              >
                Created At
              </SortableTableHeader>
              <SortableTableHeader
                field="updateDateTime"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="min-w-[140px]"
              >
                Updated At
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
            {currentRecords.map((item, index) => (
              <tr key={item?.id || item?.transactionId || item?.ref_Id || index} className={getRowBackgroundClass(index)}>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    currentMode === "Dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.ref_Id || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.transactionId || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.userId || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.currencyCode || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.issuingOrg || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.issuingCountry || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.cardType === 'DEBIT'
                        ? 'bg-blue-100 text-blue-800'
                        : item.cardType === 'CREDIT'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.cardType || "-"}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.cardholderName || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.cardName || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    currentMode === "Dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.amount || item.value || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.cardCategory || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.state === 'PURCHASED'
                        ? 'bg-green-100 text-green-800'
                        : item.state === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.state || "-"}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDate(item.createDateTime)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDate(item.updateDateTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalRecords={sortedRecords.length}
          backendLimit={recordsPerPage}
          recordsCount={currentRecords.length}
        />
      )}

      {/* No Records Message for search/filter results */}
      {sortedRecords.length === 0 && (searchTerm || cardTypeFilter !== "ALL" || statusFilter !== "ALL") && (
        <EmptyState
          title="No Matching Transactions Found"
          message="No transactions match your search or filter criteria. Try adjusting your search terms or filters."
          iconType="search"
          showRefreshButton={false}
          className="py-16"
        />
      )}
    </div>
  );
};

export default Network;