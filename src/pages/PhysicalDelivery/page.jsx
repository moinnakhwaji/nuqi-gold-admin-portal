import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import {
  useGetPhysicalDeliveriesQuery,
  useUpdatePhysicalDeliveryStatusMutation,
} from "../../redux/slices/physicalDelivery/physicalDeliveryApi";
import { Pagination, StatusModal } from "../../components";
import DeliveryModal from "../../components/DeliveryModal";
import { useSelector } from "react-redux";

const PhysicalDelivery = () => {
  // --- Component State ---
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
   const user = useSelector((state) => state.auth.user); // ✅ Get the full user object
  const userRole = user?.role; // ✅ Get the role
  
  // State for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for Delivery Details Modal
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Status Confirmation Modal
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalData, setStatusModalData] = useState(null);
  
  // State to track the specific order being updated
  const [updatingOrderId, setUpdatingOrderId] = useState(null);


  // --- Redux Toolkit Query Hooks ---
  
  // Fetch delivery data from API
  const {
    data: deliveryResponse,
    isLoading,
    error,
    refetch, // Added refetch to easily refresh data
  } = useGetPhysicalDeliveriesQuery();

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
      setSelectedStatus(prev => ({ ...prev, [orderId]: null }));
      setOpenDropdown(null);
      // No need to refetch manually, RTK Query handles cache invalidation if configured
      
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage = err.data?.message || err.error || "Failed to update status.";
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
      const orderData = deliveries.find(d => d.order_id === orderId);
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
    setSelectedStatus(prev => ({ ...prev, [orderId]: status }));
    setOpenDropdown(null); // Close dropdown after selection
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
  }

  // --- Data Filtering and Pagination ---

  // Filter deliveries based on the search input
  const searchFilteredDeliveries = deliveries.filter(
    (delivery) =>
      (delivery.user_id?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (delivery.order_id?.toLowerCase() || "").includes(search.toLowerCase())
  );
  
  // Reset to the first page whenever the search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  
  // Calculate pagination values
  const totalItems = searchFilteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const paginatedDeliveries = searchFilteredDeliveries.slice(startIndex, endIndex);

  // --- UI Helpers ---

  const getStatusColor = (status) => {
    // (Implementation is the same as your original code)
    switch (status?.toLowerCase()) {
      case "processed": return "bg-blue-100 text-blue-800";
      case "on the way": return "bg-yellow-100 text-yellow-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "pending": return "bg-gray-100 text-gray-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "Processed", label: "Processed", color: "text-blue-600" },
    { value: "On_The_Way", label: "Transit", color: "text-yellow-600" },
    { value: "Delivered", label: "Delivered", color: "text-green-600" },
  ];

  const getAvailableOptions = (currentStatus) => {
    return statusOptions.filter(option => {
      const normalizedCurrent = currentStatus?.toLowerCase().replace(/[_\s]/g, '');
      const normalizedOption = option.value.toLowerCase().replace(/[_\s]/g, '');
      return normalizedCurrent !== normalizedOption;
    });
  };
  
  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };
  
  const csvData = searchFilteredDeliveries.map((delivery) => ({
    // (CSV data mapping is the same as your original code)
    "Order ID": delivery.order_id || "N/A",
    "User Nuqi ID": delivery.user_id || "N/A",
    "Amount (AED)": delivery.total_payable_aed || "N/A",
    Address: delivery.emirate || "N/A",
    Status: delivery.status || "N/A",
    "Expected Delivery": delivery.estimated_delivery_date
      ? new Date(delivery.estimated_delivery_date).toLocaleDateString()
      : "N/A",
  }));

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Physical Delivery Management</h2>
        <p>Loading delivery data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Physical Delivery Management</h2>
        <p className="text-red-500">Failed to load delivery data. Please try again.</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Physical Delivery Management</h2>

      <div className="flex flex-col space-y-4">
        {/* Search and Export */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by user ID or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 px-3 py-2 border rounded"
          />
          <CSVLink data={csvData} filename="physical-deliveries.csv" className="bg-[#0472E5] text-white px-4 py-2 rounded">
            Download
          </CSVLink>
           <button onClick={() => refetch()} disabled={isLoading} className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50">
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Deliveries Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            {/* Table Head */}
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-medium">User Nuqi ID</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Address</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Expected Delivery</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {paginatedDeliveries.length > 0 ? (
                paginatedDeliveries.map((delivery) => {
                  const availableOptions = getAvailableOptions(delivery.status);
                  const hasSelectedStatus = selectedStatus[delivery.order_id];
                  const isCurrentOrderUpdating = updatingOrderId === delivery.order_id;
                  
                  return (
                    <tr key={delivery.order_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{delivery.order_id || "-"}</td>
                      <td className="px-4 py-3">{delivery.user_id || "-"}</td>
                      <td className="px-4 py-3">{delivery.total_payable_aed || "-"}</td>
                      <td className="px-4 py-3 truncate max-w-xs" title={delivery.emirate || "-"}>{delivery.emirate || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {delivery.estimated_delivery_date ? new Date(delivery.estimated_delivery_date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                            {/* Status Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() => toggleDropdown(delivery.order_id)}
                                disabled={isCurrentOrderUpdating}
                                className="flex items-center gap-1 px-3 py-2 text-xs rounded border"
                              >
                                {selectedStatus[delivery.order_id] || "Select Status"}
                              </button>
                              {openDropdown === delivery.order_id && (
                                <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-20">
                                  {availableOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => handleStatusSelection(delivery.order_id, option.value)}
                                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${option.color}`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleViewDetails(delivery)}
                              className="px-3 py-2 text-xs bg-green-500 text-white rounded"
                            >
                              View
                            </button>   
                            {/* Submit and View Buttons */}
                          {(userRole === "admin" || userRole === "superadmin") && (
  <button
    onClick={() => handleSubmitStatusUpdate(delivery.order_id)}
    disabled={isCurrentOrderUpdating || !hasSelectedStatus}
    className="px-3 py-2 text-xs bg-blue-500 text-white rounded disabled:opacity-50"
  >
    {isCurrentOrderUpdating ? "Updating..." : "Submit"}
  </button>
)}

                         
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No delivery data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
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