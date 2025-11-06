import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiCalendar, FiX } from 'react-icons/fi';
import { useGetKycRecordsQuery, useLazyExportKycRecordsQuery } from "../../redux/slices/kyc/kycApi";
import {
  Header,
  ExportCSVButton,
  Pagination,
  EmptyState,
  SortableTableHeader,
} from "../../components";
import SearchBox from "../../components/SearchBox";
import { useStateContext } from "../../contexts/ContextProvider";

const KycVerifiedPage = () => {
  const { currentMode } = useStateContext();
  const { kycRecords = [], loading: isLoading, error, currentPage: sliceCurrentPage, totalRecords, totalPages, limit: backendLimit } = useSelector((state) => state.kyc);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Date filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  const currentPage = localCurrentPage;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data using RTK Query
  const { data, refetch, isFetching } = useGetKycRecordsQuery({
    page: currentPage,
    search: debouncedSearchTerm,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  
  useEffect(() => {
    console.log("🔄 Page changed, refetching data for page:", currentPage);
    if (refetch) {
      refetch();
    }
  }, [currentPage, debouncedSearchTerm, startDate, endDate, refetch]);

  useEffect(() => {
    if (kycRecords.length > 0 || error) {
      setIsInitialLoad(false);
    }
  }, [kycRecords.length, error]);
  
  useEffect(() => {
    console.log("🔍 KYC Slice Data:", {
      kycRecords: kycRecords,
      recordsCount: kycRecords?.length,
      loading: isLoading,
      error: error,
      currentPage: sliceCurrentPage,
      totalRecords: totalRecords,
      totalPages: totalPages,
      filters: { startDate, endDate }
    });
  }, [kycRecords, isLoading, error, localCurrentPage, sliceCurrentPage, totalRecords, totalPages, searchTerm, startDate, endDate]);

  if (isLoading || isFetching || (isInitialLoad && !error)) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white border-1 border-blue-300"
        }`}
      >
        <Header category="Page" title="KYC Verified Records" />
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
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100"
            : "bg-white border-1 border-blue-300"
        }`}
      >
        <Header category="Page" title="KYC Verified Records" />
        <EmptyState
          variant="error"
          title="Unable to Load KYC Records"
          message="We encountered an issue while loading the KYC records. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
        />
      </div>
    );
  }

  if (kycRecords.length === 0 && !isLoading && !isFetching && !error && !isInitialLoad) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="KYC Verified Records" />
        <EmptyState
          title="No KYC Records Found"
          message="KYC records will appear here once they are verified."
          iconType="document"
        />
      </div>
    );
  }

  const sortRecords = (records, field, direction) =>
    [...records].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      if (field === "createdAt" || field === "updatedAt") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
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

  const sortedRecords = sortRecords(kycRecords || [], sortField, sortDirection);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setLocalCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    console.log("🔄 Page change requested:", pageNumber);
    setLocalCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.trim());
    setLocalCurrentPage(1);
  };

  const handleDateFilterApply = () => {
    setLocalCurrentPage(1);
    setShowDateFilter(false);
  };

  const handleDateFilterClear = () => {
    setStartDate("");
    setEndDate("");
    setLocalCurrentPage(1);
  };

  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("en-GB");
    } catch (e) {
      return dateString;
    }
  };

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) {
      return dateString;
    }
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div
      className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
        currentMode === "Dark"
          ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
          : "bg-white shadow-lg border-1 border-blue-300"
      }`}
    >
      <Header category="Page" title="KYC Verified Records" />

      {/* Search Box, Date Filter and Export Button */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="w-full sm:w-auto sm:flex-1">
              <SearchBox
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by User ID or Full Name"
              />
            </div>
            
            {/* Date Filter Toggle Button */}
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                currentMode === "Dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"
              } ${(startDate || endDate) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <FiCalendar className="text-lg" />
              <span className="text-sm font-medium">Date Filter</span>
              {(startDate || endDate) && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>

          <ExportCSVButton
            exportHook={useLazyExportKycRecordsQuery}
            currentFilters={{
              search: debouncedSearchTerm,
              startDate: startDate || undefined,
              endDate: endDate || undefined,
            }}
            filename="kyc-records.csv"
            buttonText="Export to CSV"
          />
        </div>

        {/* Date Filter Panel */}
        {showDateFilter && (
          <div
            className={`p-4 rounded-lg border ${
              currentMode === "Dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium ${currentMode === "Dark" ? "text-gray-300" : "text-gray-700"}`}>
                  From:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    currentMode === "Dark"
                      ? "bg-gray-900 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-700"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium ${currentMode === "Dark" ? "text-gray-300" : "text-gray-700"}`}>
                  To:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    currentMode === "Dark"
                      ? "bg-gray-900 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-700"
                  }`}
                />
              </div>

              <button
                onClick={handleDateFilterApply}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
              >
                Apply
              </button>

              {(startDate || endDate) && (
                <button
                  onClick={handleDateFilterClear}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    currentMode === "Dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <FiX />
                  Clear
                </button>
              )}
            </div>

            {/* Active Filter Display */}
            {(startDate || endDate) && (
              <div className="mt-3 pt-3 border-t border-gray-600">
                <p className={`text-sm ${currentMode === "Dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <span className="font-medium">Active Filter:</span>{" "}
                  {startDate && `From ${new Date(startDate).toLocaleDateString("en-GB")}`}
                  {startDate && endDate && " - "}
                  {endDate && `To ${new Date(endDate).toLocaleDateString("en-GB")}`}
                </p>
              </div>
            )}
          </div>
        )}
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
                field="id"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                ID
              </SortableTableHeader>
              <SortableTableHeader
                field="userId"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                User ID
              </SortableTableHeader>
              <SortableTableHeader
                field="fullName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Full Name
              </SortableTableHeader>
              <SortableTableHeader
                field="documentType"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Document Type
              </SortableTableHeader>
              <SortableTableHeader
                field="address"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Address
              </SortableTableHeader>
              <SortableTableHeader
                field="createdAt"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Created At
              </SortableTableHeader>
              <SortableTableHeader
                field="updatedAt"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Updated At
              </SortableTableHeader>
              <SortableTableHeader
                field="dateOfBirth"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Date of Birth
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
            {sortedRecords.map((record, index) => (
              <tr key={record.id} className={getRowBackgroundClass(index)}>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    currentMode === "Dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {record.id}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.userId || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.fullName || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.documentType || "-"}
                </td>
                <td
                  className={`px-6 py-4 text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  <div className="w-48">
                    <p className="line-clamp-3" title={record.address}>
                      {record.address || "-"}
                    </p>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDate(record.createdAt)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDate(record.updatedAt)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDateOfBirth(record.dateOfBirth) || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalRecords={totalRecords}
        backendLimit={backendLimit}
        recordsCount={sortedRecords.length}
      />

      {/* No Records Message for search results */}
      {sortedRecords.length === 0 && searchTerm && (
        <EmptyState
          title="No KYC Records Found"
          message="No records match your search criteria. Try adjusting your search terms."
          iconType="document"
          showRefreshButton
          buttonText="Refresh KYC Records"
          className="py-16"
        />
      )}
    </div>
  );
};

export default KycVerifiedPage;