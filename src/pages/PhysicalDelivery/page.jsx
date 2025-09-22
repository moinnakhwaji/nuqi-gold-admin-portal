import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetPhysicalDeliveriesQuery,
  useUpdatePhysicalDeliveryStatusMutation,
  useLazyExportPhysicalDeliveriesQuery,
} from "../../redux/slices/physicalDelivery/physicalDeliveryApi";
import {
  Pagination,
  StatusModal,
  Header,
  EmptyState,
  SearchBox,
  ExportCSVButton,
  StatusTabs,
  SortableTableHeader,
} from "../../components";
import DeliveryModal from "../../components/DeliveryModal";
import { useSelector, useDispatch } from "react-redux";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  setActiveStatus,
  setSearch,
  setCurrentPage,
  selectActiveStatus,
  selectSearch,
  selectCurrentPage,
  selectItemsPerPage,
} from "../../redux/slices/physicalDelivery/physicalDeliverySlice";
import { HiOutlineRefresh } from 'react-icons/hi';


const PhysicalDelivery = () => {
  const { currentMode } = useStateContext();

  // --- Component State ---
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");

  // Redux state
  const search = useSelector(selectSearch);
  const activeStatus = useSelector(selectActiveStatus);
  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Status tabs configuration
  const statusTabs = [
    { value: "PLACED", label: "Placed" },
    { value: "PROCESSED", label: "Processed" },
    { value: "ON_THE_WAY", label: "On The Way" },
    { value: "DELIVERED", label: "Delivered" },
  ].map((tab) => ({
    ...tab,
    label: tab.label.replace("_", " "),
  }));

  // State for Delivery Details Modal
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Status Confirmation Modal
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalData, setStatusModalData] = useState(null);

  // State to track the specific order being updated
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // --- Redux Toolkit Query Hooks ---

  // Fetch delivery data from API with filters
  const {
    data: deliveryResponse,
    isLoading,
    error,
    refetch, // Added refetch function from RTK Query
  } = useGetPhysicalDeliveriesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: search,
    status: activeStatus,
    sort_field: sortField,
    sort_direction: sortDirection,
  });

  // Update order status mutation
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdatePhysicalDeliveryStatusMutation();

  // Memoize or define deliveries to prevent re-renders
  const deliveries = deliveryResponse?.data || [];

  // --- Event Handlers and Logic ---

  // Main function to handle the API call for status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId); // Set loading state for this specific order
    const toastId = toast.loading(`Updating status to ${newStatus}...`);

    try {
      await updateOrderStatus({
        order_id: orderId,
        status_to: newStatus,
        message: `Order status updated to ${newStatus}`,
        actor: "admin",
      }).unwrap();
      
      toast.dismiss(toastId);
      toast.success(`Order status successfully updated to ${newStatus}`);

      // Clear selection and close dropdown after successful update
      setSelectedStatus((prev) => ({ ...prev, [orderId]: null }));
      setOpenDropdown(null);

      // Reset to first page if we're not on it
      if (currentPage !== 1) {
        dispatch(setCurrentPage(1));
      }
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.data?.message || err.error || "Failed to update status.";
      toast.error(`Error: ${errorMessage}`);
      setOpenDropdown(null);
    } finally {
      setUpdatingOrderId(null); // Clear loading state for the order
    }
  };

  // Step 1: User clicks submit, this opens the confirmation modal
  const handleSubmitStatusUpdate = (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (newStatus) {
      const orderData = deliveries.find((d) => d.order_id === orderId);
      setStatusModalData({ orderData, newStatus, orderId });
      setStatusModalOpen(true);
    } else {
      toast.warn("Please select a status before submitting.");
    }
  };

  // Step 2: User confirms in the modal, this triggers the actual API call
  const handleConfirmStatusUpdate = () => {
    if (statusModalData) {
      const { orderId, newStatus } = statusModalData;
      handleStatusUpdate(orderId, newStatus);
      setStatusModalOpen(false);
      setStatusModalData(null);
    }
  };

  const handleStatusSelection = (orderId, status) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: status }));
    setOpenDropdown(null);
  };

  // Handlers for Delivery Details Modal
  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDelivery(null);
  };

  // Handler for Status Modal Close
  const handleStatusModalClose = () => {
    setStatusModalOpen(false);
    setStatusModalData(null);
  };

  // --- Data Filtering and Pagination ---

  // Get row background class for alternating colors
  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  // Get pagination values from API response
  const totalItems = deliveryResponse?.totalRecords || 0;
  const totalPages = deliveryResponse?.totalPages || 1;
  const paginatedDeliveries = deliveryResponse?.data || [];

  // --- UI Helpers ---

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processed":
        return "bg-blue-100 text-blue-800";
      case "on_the_way":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "placed":
      case "payment_confirmed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailableOptions = (delivery) => {
    if (!delivery?.availableActions) return [];

    return delivery.availableActions.map((status) => ({
      value: status,
      label: status
        .replace(/_/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      color:
        status === "PROCESSED"
          ? "text-blue-600"
          : status === "ON_THE_WAY"
          ? "text-yellow-600"
          : status === "DELIVERED"
          ? "text-green-600"
          : "text-gray-600",
    }));
  };

  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white border-1 border-blue-300"
        }`}
      >
        <Header category="Page" title="Physical Delivery Management" />
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
        <Header category="Page" title="Physical Delivery Management" />
        <EmptyState
          variant="error"
          title="Unable to Load Delivery Records"
          message="We encountered an issue while loading the delivery records. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
          onButtonClick={refetch}
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
      <Header category="Page" title="Physical Delivery Management" />

      <div className="flex flex-col space-y-4">
        {/* Search, Export, and Refresh */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <SearchBox
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search by user ID or order ID..."
          />
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-all text-white ${
                currentMode === 'Dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } disabled:opacity-50`}
              title="Refresh Data"
            >
              <HiOutlineRefresh size={20} />
            </button>
            <ExportCSVButton
              exportHook={useLazyExportPhysicalDeliveriesQuery}
              currentFilters={{
                search: search,
                status: activeStatus,
              }}
              filename="physical-deliveries.csv"
              buttonText="Export CSV"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <StatusTabs
          tabs={statusTabs}
          activeTab={activeStatus}
          onTabChange={(value) => dispatch(setActiveStatus(value))}
          color="blue"
        />

        {/* Deliveries Table */}
        <div className="overflow-x-auto">
          <table
            className={`min-w-full border ${
              currentMode === "Dark"
                ? "bg-transparent border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            {/* Table Head */}
            <thead
              className={
                currentMode === "Dark" ? "bg-transparent" : "bg-gray-50"
              }
            >
              <tr>
                {/* Table Headers with Sorting */}
                <SortableTableHeader 
                  field="id"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  ID
                </SortableTableHeader>
                <SortableTableHeader
                  field="order_id"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Order ID
                </SortableTableHeader>
                <SortableTableHeader
                  field="user_id"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  User Nuqi ID
                </SortableTableHeader>
                <SortableTableHeader
                  field="total_payable_aed"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Amount
                </SortableTableHeader>
                 <SortableTableHeader
                  field="gold_qty" // Assuming backend supports sorting by this
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Gold Qty
                </SortableTableHeader>
                <SortableTableHeader
                  field="emirate"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Address
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
                  field="created_at" // Assuming backend uses this field name
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Order Date
                </SortableTableHeader>
                <SortableTableHeader
                  field="estimated_delivery_date"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Expected Delivery
                </SortableTableHeader>
                <th
                  className={`px-6 py-4 text-left text-xs font-medium ${
                    currentMode === "Dark" ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody
              className={`divide-y ${
                currentMode === "Dark"
                  ? "bg-transparent divide-gray-800"
                  : "bg-white divide-gray-200"
              }`}
            >
              {paginatedDeliveries.length > 0 ? (
                paginatedDeliveries.map((delivery, index) => {
                  const availableOptions = getAvailableOptions(delivery);
                  const hasSelectedStatus = selectedStatus[delivery.order_id];
                  const isCurrentOrderUpdating =
                    updatingOrderId === delivery.order_id;

                  return (
                    <tr
                      key={delivery.order_id}
                      className={getRowBackgroundClass(index)}
                    >
                      {/* ID */}
                        <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {delivery.id || "-"}
                      </td>

                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {delivery.order_id || "-"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {delivery.user_id || "-"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {delivery.total_payable_aed || "-"}
                      </td>
                        <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {delivery.items?.length > 0
                          ? delivery.items.reduce(
                              (total, item) => total + (item.qty || 0),
                              0
                            )
                          : "-"}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <div className="w-48">
                          <p
                            className="line-clamp-3"
                            title={delivery.emirate || "-"}
                          >
                            {delivery.emirate || "-"}
                          </p>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          {delivery.status === "PAYMENT_CONFIRMED"
                            ? "PLACED"
                            : delivery.status || "-"}
                        </span>
                      </td>
                        <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {delivery.created_at
                          ? new Date(delivery.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {delivery.estimated_delivery_date
                          ? new Date(
                              delivery.estimated_delivery_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          currentMode === "Dark"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Status Dropdown - Only show if there are available actions */}
                          {availableOptions.length > 0 &&
                            (userRole === "admin" ||
                              userRole === "superadmin") && (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    toggleDropdown(delivery.order_id)
                                  }
                                  disabled={isCurrentOrderUpdating}
                                  className={`flex items-center justify-between gap-2 px-4 py-2 text-xs rounded-lg border transition-all min-w-[120px] ${
                                    currentMode === "Dark"
                                      ? "border-gray-700 hover:border-gray-600 text-white"
                                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                                  }`}
                                >
                                  <span>
                                    {selectedStatus[delivery.order_id] ||
                                      "Select Status"}
                                  </span>
                                  <svg
                                    className={`w-4 h-4 transition-transform ${
                                      openDropdown === delivery.order_id
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                                {openDropdown === delivery.order_id && (
                                  <div
                                    className={`absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-20 min-w-[120px] ${
                                      currentMode === "Dark"
                                        ? "bg-gray-800 border-gray-700"
                                        : "bg-white border-gray-200"
                                    }`}
                                  >
                                    <div className="flex flex-col py-1">
                                      {availableOptions.map((option) => (
                                        <button
                                          key={option.value}
                                          onClick={() =>
                                            handleStatusSelection(
                                              delivery.order_id,
                                              option.value
                                            )
                                          }
                                          className={`w-full text-left px-4 py-2 text-xs hover:bg-opacity-10 ${
                                            currentMode === "Dark"
                                              ? "hover:bg-white text-white"
                                              : "hover:bg-black text-gray-700"
                                          } ${option.color}`}
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                          {/* View Button */}
                          <button
                            onClick={() => handleViewDetails(delivery)}
                            className={`px-3 py-2 text-xs text-white rounded-lg transition-all ${
                              currentMode === "Dark"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            View
                          </button>

                          {/* Submit Button - Only show if status is selected */}
                          {availableOptions.length > 0 &&
                            (userRole === "admin" ||
                              userRole === "superadmin") && (
                              <button
                                onClick={() =>
                                  handleSubmitStatusUpdate(delivery.order_id)
                                }
                                disabled={
                                  isCurrentOrderUpdating || !hasSelectedStatus
                                }
                                className={`px-3 py-2 text-xs text-white rounded-lg transition-all ${
                                  currentMode === "Dark"
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-blue-600 hover:bg-blue-700"
                                } disabled:opacity-50`}
                              >
                                {isCurrentOrderUpdating
                                  ? "Updating..."
                                  : "Submit"}
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    No delivery data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
          totalRecords={totalItems}
          backendLimit={itemsPerPage}
          recordsCount={paginatedDeliveries.length}
        />
      </div>

      {/* --- Modals --- */}
      <DeliveryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        deliveryData={selectedDelivery}
      />
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={handleStatusModalClose}
        onConfirm={handleConfirmStatusUpdate}
        orderData={statusModalData?.orderData}
        newStatus={statusModalData?.newStatus}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default PhysicalDelivery;