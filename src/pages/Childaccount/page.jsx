import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useGetKidzAccountQuery,
  useLazyExportKidzAccountQuery,
  useApproveKidzAccountMutation,
  useRejectKidzAccountMutation,
  useGetChildTemplatesQuery,
  useOnHoldChildUserMutation,
} from "../../redux/slices/kidzaccount/KidzApi";
import {
  Header,
  ExportCSVButton,
  Pagination,
  EmptyState,
  SortableTableHeader,
  StatusModal,
} from "../../components";
import SearchBox from "../../components/SearchBox";
import { useStateContext } from "../../contexts/ContextProvider";
import ChildAccountDetailsModal from "../../components/ChildAccountDetailsModal";

const Childaccount = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: templatesData } = useGetChildTemplatesQuery();
  // ✅ FIX 1: Access the nested 'data' property from the API response
  const templates = templatesData?.data || [];

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [templates, selectedTemplateId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [onHoldChildUser, { isLoading: isOnHoldLoading }] =
    useOnHoldChildUserMutation();

  // ✅ FIX 2: Refactored handleOnhold to use state directly, making it more reliable.
  // It no longer needs the childId to be passed as an argument.
  const handleOnhold = async () => {
    if (!selectedRecord) {
      toast.error("Error: No record selected for this operation.");
      return;
    }
    if (!selectedTemplateId) {
      toast.error("Please select a reason template before putting the user on hold.");
      return;
    }

    const childId = selectedRecord.id;

    try {
      await onHoldChildUser({
        childId,
        status: "onhold",
        templateId: selectedTemplateId,
        child_id: childId,
      }).unwrap();

      toast.success("User put on hold successfully");
      handleCloseModal(); // Close the modal on success
    } catch (err) {
      console.error("Error putting user on hold:", err);
      const errorMessage =
        err.data?.message || "Failed to put user on hold. Please try again.";
      toast.error(errorMessage);
    }
  };

  const { isLoading, error, data } = useGetKidzAccountQuery({
    page: currentPage,
    search: debouncedSearchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [approveKidzAccount, { isLoading: isApproving }] =
    useApproveKidzAccountMutation();
  const [rejectKidzAccount, { isLoading: isRejecting }] =
    useRejectKidzAccountMutation();

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
        <Header category="Page" title="All Child Account Records" />
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
        <Header category="Page" title="All Child Account Records" />
        <EmptyState
          variant="error"
          title="Unable to Load Child Account Records"
          message="We encountered an issue while loading the records. Please try refreshing the page."
          buttonText="Refresh Page"
        />
      </div>
    );
  }

  const kidzAccountRecords = data?.data || [];
  const totalRecords = data?.totalRecords || 0;
  const backendLimit = data?.limit || 10;
  const totalPages = data?.totalPages || 0;

  if (kidzAccountRecords.length === 0 && !searchTerm && statusFilter === 'all') {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg"
        }`}
      >
        <Header category="Page" title="Child Account Records" />
        <EmptyState
          title="No Child Records Found"
          message="Child account records will appear here once they are created."
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

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (direction === "asc") {
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
      }
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    });
  
  const sortedRecords = sortRecords(
    kidzAccountRecords,
    sortField,
    sortDirection
  );

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

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleClearFilter = () => {
    setStatusFilter("all");
    setCurrentPage(1);
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  const showStatusModal = (type, title, message) => {
    setStatusModal({ isOpen: true, type, title, message });
  };

  const handleCloseStatusModal = () => {
    setStatusModal({ isOpen: false, type: "success", title: "", message: "" });
  };

  const handleApprove = async (childId) => {
    try {
      await approveKidzAccount(childId).unwrap();
      showStatusModal("success", "Account Approved", "The child account has been successfully approved.");
      handleCloseModal();
    } catch (approveError) {
      console.error("Error approving child account:", approveError);
      showStatusModal("error", "Approval Failed", "There was an error approving the child account.");
    }
  };

  const handleReject = async (childId) => {
    try {
      await rejectKidzAccount(childId).unwrap();
      showStatusModal("success", "Account Rejected", "The child account has been successfully rejected.");
      handleCloseModal();
    } catch (rejectError) {
      console.error("Error rejecting child account:", rejectError);
      showStatusModal("error", "Rejection Failed", "There was an error rejecting the child account.");
    }
  };

  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "onhold": return "bg-orange-100 text-orange-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
      <Header category="Page" title="All Child Account Records" />

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <SearchBox
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by User ID or Full Name"
          />
          <div className="flex items-center gap-2">
            <label 
              htmlFor="status-filter" 
              className={`text-sm font-medium whitespace-nowrap ${
                currentMode === "Dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] ${
                currentMode === "Dark"
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="onhold">On Hold</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <ExportCSVButton
          exportHook={useLazyExportKidzAccountQuery}
          currentFilters={{
            search: debouncedSearchTerm,
            status: statusFilter !== "all" ? statusFilter : undefined,
          }}
          filename="kidz-records.csv"
          buttonText="Export to CSV"
        />
      </div>

      {statusFilter !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className={`text-sm ${currentMode === "Dark" ? "text-gray-300" : "text-gray-600"}`}>
            Filtered by status:
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(statusFilter)}`}>
            {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </span>
          <button
            onClick={handleClearFilter}
            className={`text-sm underline hover:no-underline ${
              currentMode === "Dark" ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            Clear Filter
          </button>
        </div>
      )}

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
                field="childFirstName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Child First Name
              </SortableTableHeader>
              <SortableTableHeader
                field="childLastName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Child Last Name
              </SortableTableHeader>
              <SortableTableHeader
                field="childUserName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Child User Name
              </SortableTableHeader>
              <SortableTableHeader
                field="childDob"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Child DOB
              </SortableTableHeader>
              <SortableTableHeader
                field="relation"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Relation to Child
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
              <SortableTableHeader
                field="updatedAt"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Updated At
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
                  {record.childFirstName || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.childLastName || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.childUserName || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.childDob
                    ? new Date(record.childDob).toLocaleDateString()
                    : "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.relation || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                      record.status
                    )}`}
                  >
                    {record.status || "-"}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {record.updatedAt
                    ? new Date(record.updatedAt).toLocaleString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(record)}
                    className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 border border-transparent rounded-lg shadow-sm hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    View Details
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse rounded-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalRecords={totalRecords}
        backendLimit={backendLimit}
        recordsCount={sortedRecords.length}
      />

      {sortedRecords.length === 0 && (searchTerm || statusFilter !== "all") && (
        <EmptyState
          title="No Records Found"
          message={
            statusFilter !== "all" && searchTerm
              ? `No records match your search criteria and status filter "${statusFilter}".`
              : statusFilter !== "all"
              ? `No records found with status "${statusFilter}".`
              : "No records match your search criteria."
          }
          iconType="document"
          className="py-16"
        />
      )}

      <ChildAccountDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedRecord={selectedRecord}
        currentMode={currentMode}
        onApprove={handleApprove}
        onReject={handleReject}
        onOnhold={handleOnhold}
        isApproving={isApproving}
        isRejecting={isRejecting}
        isOnHoldLoading={isOnHoldLoading}
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
      />

      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={handleCloseStatusModal}
      />
    </div>
  );
};

export default Childaccount;