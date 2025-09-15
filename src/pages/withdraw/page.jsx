import React, { useState, useEffect } from "react";
import { useGetWithdrawalsQuery, useApproveWithdrawalMutation, useLazyExportWithdrawalsQuery } from "../../redux/slices/withdraw/withdrawApi";
import { useStateContext } from "../../contexts/ContextProvider";
import { toast } from 'react-toastify';
import {
  FaHourglassHalf,
  FaWallet,
  FaTimes,
} from 'react-icons/fa';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { AiOutlineSync } from 'react-icons/ai';
import { EmptyState, ExportCSVButton, Header, Pagination, SortableTableHeader } from "../../components";
import SearchBox from "../../components/SearchBox";
import { useSelector } from "react-redux";

const WithdrawalsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
   const user = useSelector((state) => state.auth.user); // ✅ Get the full user object
    const userRole = user?.role; // ✅ Get the role

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { isLoading, error, data } = useGetWithdrawalsQuery({
    page: currentPage,
    search: debouncedSearchTerm,
  });

  const [approveWithdrawal, { isLoading: isUpdating }] = useApproveWithdrawalMutation();
  const { currentMode } = useStateContext();

  if (isLoading || isUpdating) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
        <Header category="Page" title="Withdrawal Transactions" />
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
        <Header category="Page" title="Withdrawal Transactions" />
        <EmptyState
          variant="error"
          title="Unable to Load Withdrawal Records"
          message="We encountered an issue while loading the withdrawal records. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
        />
      </div>
    );
  }

  const withdrawalRecords = data?.data || [];
  const totalRecords = data?.totalRecords || 0;
  const backendLimit = data?.limit || 10;
  const totalPages = data?.totalPages || 0;

  if (withdrawalRecords.length === 0) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Withdrawal Transactions" />
        <EmptyState
          title="No Withdrawal Records Found"
          message="Withdrawal records will appear here once they are submitted."
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

  const sortedRecords = sortRecords(withdrawalRecords, sortField, sortDirection);

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

  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  const updateStatus = async (id, status) => {
    try {
      await approveWithdrawal({ id, status }).unwrap();
      toast.success(`Transaction marked as ${status}!`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.data?.message || 'Failed to update transaction status.');
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
      <Header category="Page" title="Withdrawal Transactions" />

      {/* Search Box and Export Button */}
      <div className="mb-4 flex items-center justify-between">
        <SearchBox
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Account Number or Account Name"
        />
        <ExportCSVButton
          exportHook={useLazyExportWithdrawalsQuery}
          currentFilters={{
            search: debouncedSearchTerm,
          }}
          filename="withdrawal-records.csv"
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
                field="accountName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Account Name
              </SortableTableHeader>
              <SortableTableHeader
                field="accountNumber"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Account Number
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
                Created At
              </SortableTableHeader>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  currentMode === "Dark" ? "text-gray-300" : "text-gray-500"
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
                  {record.accountName || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.accountNumber || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  ${record.amount || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium capitalize ${
                    record.status === 'approved' ? 'bg-green-100 text-green-700' :
                    record.status === 'under_review' || record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    record.status === 'in_process' ? 'bg-blue-100 text-blue-700' :
                    record.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {record.status === 'approved' && <BsFillCheckCircleFill />}
                    {(record.status === 'under_review' || record.status === 'pending') && <FaHourglassHalf />}
                    {record.status === 'in_process' && <AiOutlineSync className="animate-spin" />}
                    {record.status === 'rejected' && <FaTimes />}
                    {record.status === 'cancelled' && <FaWallet />}
                    {record.status?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
            {(userRole === "admin" || userRole === "superadmin") && (
  <div className="flex justify-center gap-2">
    {record.status === 'pending' || record.status === 'under_review' || record.status === 'in_process' ? (
      <>
        <button
          type="button"
          onClick={() => updateStatus(record.id, record.status === 'in_process' ? 'approved' : 'in_process')}
          className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {record.status === 'in_process' ? 'Approve' : 'Set In Process'}
        </button>
        <button
          type="button"
          onClick={() => updateStatus(record.id, 'rejected')}
          className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200"
        >
          Reject
        </button>
      </>
    ) : record.status === 'approved' ? (
      <span className="text-xs font-bold text-green-600">Completed</span>
    ) : record.status === 'rejected' ? (
      <span className="text-xs font-bold text-red-600">Rejected</span>
    ) : (
      <span className="text-xs font-bold text-slate-500">Cancelled</span>
    )}
  </div>
)}

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
          title="No Withdrawal Records Found"
          message="No records match your search criteria. Try adjusting your search terms."
          iconType="document"
          showRefreshButton
          buttonText="Refresh Withdrawal Records"
          className="py-16"
        />
      )}
    </div>
  );
};

export default WithdrawalsPage;