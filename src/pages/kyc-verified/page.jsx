import React, { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { isLoading, error, data } = useGetKycRecordsQuery({
    page: currentPage,
    search: debouncedSearchTerm,
  });

  const { currentMode } = useStateContext();

  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
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
            : "bg-white"
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

  const kycRecords = data?.data || [];
  const totalRecords = data?.totalRecords || 0;
  const backendLimit = data?.limit || 10;
  const totalPages = data?.totalPages || 0;

  // If no data available, show empty state
  if (kycRecords.length === 0) {
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

  const sortedRecords = sortRecords(kycRecords, sortField, sortDirection);

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
    setSearchTerm(e.target.value.trim());
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

  // Format date of birth helper function
  const formatDateOfBirth = (dateString) => {
    if (!dateString) return "";
    // If it's already in DD/MM/YYYY format, return as is
    if (dateString.includes("/")) {
      return dateString;
    }
    // Otherwise try to format it
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
          : "bg-white shadow-lg"
      }`}
    >
      <Header category="Page" title="KYC Verified Records" />

      {/* Search Box and Export Button */}
      <div className="mb-4 flex items-center justify-between">
        <SearchBox
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by User ID or Full Name"
        />
        <ExportCSVButton
          exportHook={useLazyExportKycRecordsQuery}
          currentFilters={{
            search: debouncedSearchTerm,
          }}
          filename="kyc-records.csv"
          buttonText="Export to CSV"
        />
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
                field="fullNameHindi"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Full Name (Hindi)
              </SortableTableHeader>
              <SortableTableHeader
                field="dateOfBirth"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Date of Birth
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
                field="sex"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Gender
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
                field="match"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Match Status
              </SortableTableHeader>
              <SortableTableHeader
                field="matchLevel"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Match Level
              </SortableTableHeader>
              <SortableTableHeader
                field="sdkType"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                SDK Type
              </SortableTableHeader>
              <SortableTableHeader
                field="sdkVersion"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                SDK Version
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
                  {record.fullNameHindi || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDateOfBirth(record.dateOfBirth) || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.documentType || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.sex || "-"}
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
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.match
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.match ? "Matched" : "Not Matched"}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.matchLevel || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.sdkType || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.sdkVersion || "-"}
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