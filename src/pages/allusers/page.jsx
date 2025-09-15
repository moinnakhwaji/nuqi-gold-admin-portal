import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetallusersQuery } from "../../redux/slices/allusers/allusersApi";
import {
  Header,
  ExportCSVButton,
  Pagination,
  EmptyState,
  SortableTableHeader,
} from "../../components";
import SearchBox from "../../components/SearchBox";
import { useStateContext } from "../../contexts/ContextProvider";

const AllUsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { isLoading, error, data } = useGetallusersQuery({
    page: currentPage,
    search: debouncedSearchTerm,
    sortField,
    sortDirection,
  });

  const { currentMode } = useStateContext();
// this is comment 2
  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
        <Header category="Page" title="All Users Portfolio" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
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
        <Header category="Page" title="All Users Portfolio" />
        <EmptyState
          title="Unable to Load Portfolios"
          message="We encountered an issue while loading the all users portfolios data. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
          variant="error"
        />
      </div>
    );
  }

  const allusers = data?.data || [];
  const totalRecords = data?.total || 0;
  const backendLimit = data?.limit || 10;
  const totalPages = Math.ceil(totalRecords / backendLimit);

  // If no data available, show empty state (consistent with other pages)
  if (allusers.length === 0) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="All Users Portfolio" />
        <EmptyState
          title="No User Portfolios Found"
          message="User portfolios will appear here once they are created."
          iconType="users"
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

      if (field === "created_at") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (field === "first_name") {
        aValue = `${a.first_name || ""} ${a.last_name || ""}`
          .trim()
          .toLowerCase();
        bValue = `${b.first_name || ""} ${b.last_name || ""}`
          .trim()
          .toLowerCase();
      }

      if (
        typeof aValue === "string" &&
        aValue !== "" &&
        field !== "first_name"
      ) {
        aValue = aValue.toLowerCase();
      }
      if (
        typeof bValue === "string" &&
        bValue !== "" &&
        field !== "first_name"
      ) {
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

  const sortedRecords = sortRecords(allusers, sortField, sortDirection);

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
      return "bg-gradient-to-r from-black via-slate-900 to-black hover:bg-slate-800/30 cursor-pointer";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  const openPortfolio = (record) => {
    navigate("/portfolio", { state: { record } });
  };

  return (
    <div
      className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
        currentMode === "Dark"
          ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
          : "bg-white shadow-lg"
      }`}
    >
      <Header category="Page" title="All Users Portfolio" />
      {/* Search Box and Export Button */}
      <div className="mb-4 flex items-center justify-between">
        <SearchBox
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Email"
        />
        <ExportCSVButton
          data={sortedRecords}
          filename="all-users.xlsx"
          buttonText="Export to Excel"
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
                field="user.id"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                User ID
              </SortableTableHeader>
              <SortableTableHeader
                field="user.email"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Email
              </SortableTableHeader>
              <SortableTableHeader
                field="overall.currentValue"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Current Value
              </SortableTableHeader>
              <SortableTableHeader
                field="overall.investedAmount"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Invested Amount
              </SortableTableHeader>
              <SortableTableHeader
                field="overall.pnl"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                PNL
              </SortableTableHeader>
              <SortableTableHeader
                field="overall.pnlPctChange"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                PNL Percentage Change
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
              <tr
                key={record.user.id}
                className={`${getRowBackgroundClass(index)}`}
                onClick={() => openPortfolio(record)}
              >
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    currentMode === "Dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {record.user.id}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.user.email}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.overall.currentValue.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.overall.investedAmount.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.overall.pnl.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.overall.pnlPctChange.toFixed(2)}%
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
          title="No User Portfolios Found"
          message="No portfolios match your search criteria. Try adjusting your search terms."
          iconType="users"
          showRefreshButton
          buttonText="Refresh User Portfolios"
          className="py-16"
        />
      )}
    </div>
  );
};

export default AllUsersPage;
