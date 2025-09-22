import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from 'react-icons/fa';
import { useStateContext } from '../../contexts/ContextProvider';
import {
  useGetBankKycQuery,
  useUpdateBankDetailsMutation,
  useUpdateKycRecordStatusMutation,
  useGetOnHoldBankKycMutation,
  useLazyExportBankKycRecordsQuery,
  useUpdateOnHoldKycStatusMutation, // <-- Import the new mutation hook
} from '../../redux/slices/Bankverification/bankverificationapi';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import Pagination from '../../components/Pagination';
import ReasonModal from '../../components/ReasonModal';
import BankDetailModal from '../../components/bankverification/BankDetailModal';
import ExportCSVButton from '../../components/ExportCSVButton';
import SortableTableHeader from '../../components/SortableTableHeader';

// Helper to determine tailwind classes based on KYC status
const getStatusClasses = (status) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border border-red-300';
    case 'ON_HOLD':
      return 'bg-orange-100 text-orange-800 border border-orange-300';
    case 'UNDER_REVIEW':
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const BankVerification = () => {
  const { currentMode } = useStateContext();
  
  // Component state management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedKycId, setSelectedKycId] = useState(null);

  // Map frontend tab names to backend type values
  const getTypeFromTab = (tab) => {
    switch (tab) {
      case 'pending':
        return 'PENDING';
      case 'approved':
        return 'APPROVED';
      case 'rejected':
        return 'REJECTED';
      case 'on_hold':
        return 'ON_HOLD';
      default:
        return null;
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query hooks for data fetching and mutations
  const { data: bankKycData, error, isLoading, isFetching, refetch } = useGetBankKycQuery({
    page: currentPage,
    search: debouncedSearchTerm,
    type: getTypeFromTab(selectedTab),
  });
  const [updateBankDetails, { isLoading: isUpdatingBankDetails }] = useUpdateBankDetailsMutation();
  const [updateKycRecordStatus] = useUpdateKycRecordStatusMutation();
  const [updateOnHoldKycStatus] = useUpdateOnHoldKycStatusMutation(); // <-- Instantiate new hook
  const [getOnHoldBankKyc, { isLoading: isSendingReminder }] = useGetOnHoldBankKycMutation();

  // Data processing
  const processDataWithRelevantDetails = (dataToProcess = []) => {
    return dataToProcess.map((bankDetail) => ({
      user_id: bankDetail.userId,
      fullName: bankDetail.fullName,
      relevantBankDetail: bankDetail,
     allBankDetails: [bankDetail, ...(bankDetail.previousBankRecords || [])],
      kycRecords: bankDetail.kycRecords || [],
    }));
  };

  // Process server data and calculate pagination
  const bankKycRecords = bankKycData?.data || [];
  const totalRecords = bankKycData?.totalRecords || 0;
  const backendLimit = bankKycData?.limit || 10;
  const totalPages = bankKycData?.totalPages || Math.ceil(totalRecords / backendLimit);

  const processedData = processDataWithRelevantDetails(bankKycRecords);
  
  // Sorting function
  const sortRecords = (records, field, direction) =>
    [...records].sort((a, b) => {
      let aValue = a.relevantBankDetail?.[field] || a[field];
      let bValue = b.relevantBankDetail?.[field] || b[field];

      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      if (field === "createdAt" || field === "updatedAt") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (typeof aValue === "string" && aValue !== "") aValue = aValue.toLowerCase();
      if (typeof bValue === "string" && bValue !== "") bValue = bValue.toLowerCase();

      if (direction === "asc") {
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
      }
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    });

  const sortedData = sortRecords(processedData, sortField, sortDirection);
  const filteredData = sortedData;

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch KYC data.');
      console.error('Error fetching KYC data:', error);
    }
  }, [error]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1); 
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.trim());
    setCurrentPage(1); 
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const openModal = (user) => {
    if (!user || !user.relevantBankDetail) {
      toast.error('This user has no bank details to view.');
      return;
    }
    
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditable(false);
    setSelectedUser(null);
  };

  const handleEditClick = (latestBankDetail) => {
    setIsEditable(true);
    setEditedDetails({
      holder_name: latestBankDetail.holder_name || '',
      bank_name: latestBankDetail.bank_name || '',
      branch_name: latestBankDetail.branch_name || '',
      account_number: latestBankDetail.account_number || '',
      ifsc_code: latestBankDetail.ifsc_code || '',
    });
  };
  
  const handleCancelEdit = () => setIsEditable(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (bankDetail) => {
    try {
      const payload = {
        holder_name: editedDetails.holder_name,
        bank_name: editedDetails.bank_name,
        branch_name: editedDetails.branch_name,
        account_number: editedDetails.account_number,
        ifsc_code: editedDetails.ifsc_code,
        bank_id: bankDetail.id,
      };
      
      await updateBankDetails({ user_id: bankDetail.user_id, body: payload }).unwrap();
      console.log('Bank details updated successfully', payload, bankDetail);
      toast.success('Bank details updated successfully');
      closeModal();
    } catch (err) {
      console.error('Error updating bank details:', err);
      toast.error(err.data?.message || 'Failed to update bank details');
    }
  };

  // *** MODIFIED FUNCTION ***
  // Updates KYC status using the appropriate RTK Query mutation
  const handleUpdateKycStatus = async (status, id, reason = null) => {
    try {
      const lowercaseStatus = status.toLowerCase();

      if (lowercaseStatus === 'on_hold') {
        // Use the dedicated hook for 'ON_HOLD' status
        await updateOnHoldKycStatus({ id, reason }).unwrap();
      } else {
        // Use the general hook for 'APPROVED' and 'REJECTED'
        await updateKycRecordStatus({ id, status: lowercaseStatus, reason }).unwrap();
      }
      
      toast.success(`KYC record has been updated to ${status}.`);
      closeModal();
      setIsReasonModalOpen(false);
    } catch (err) {
      console.error(`Error updating KYC status to ${status}:`, err);
      toast.error(err.data?.message || `Failed to update KYC status.`);
    }
  };
  
  const handleSendReminder = async (bankDetail) => {
    try {
      await getOnHoldBankKyc(bankDetail.id).unwrap();
      toast.success('Reminder sent successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send reminder');
      console.error('Error sending reminder:', err);
    }
  };
  
  const handleReasonConfirm = (reason) => {
    if (selectedKycId) {
      handleUpdateKycStatus('on_hold', selectedKycId, reason);
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

  const transformDocumentUrl = (url) => url?.replace(':7777/', ':7000/');

  if (isLoading || isFetching) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
        <ToastContainer />
        <Header category="Page" title="Bank KYC Verification" />
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
            : "bg-white border-1 border-yellow-400"
        }`}
      >
        <ToastContainer />
        <Header category="Page" title="Bank KYC Verification" />
        <EmptyState
          variant="error"
          title="Unable to Load Bank KYC Data"
          message="We encountered an issue while loading the bank KYC data. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
          onButtonClick={refetch}
        />
      </div>
    );
  }

  if (bankKycRecords.length === 0) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg border-1 border-yellow-400"
        }`}
      >
        <ToastContainer />
        <Header category="Page" title="Bank KYC Verification" />
        <EmptyState
          title="No Bank KYC Records Found"
          message="Bank KYC records will appear here once they are submitted."
          iconType="document"
        />
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white shadow-lg border-1 border-yellow-400"
        }`}
      >
        <ToastContainer />
        <Header category="Page" title="Bank KYC Verification" />
        
        <div className="mb-4">
          <div className="flex justify-start gap-4 p-2">
            {['pending', 'approved', 'rejected', 'on_hold'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`capitalize w-[200px] py-3 text-sm font-medium rounded-lg transition-all ${
                  selectedTab === tab ? 'bg-amber-500 text-white shadow-md' : 'border border-amber-500 text-amber-500 hover:bg-amber-50'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        
        <EmptyState
          title="No Records Found"
          message={`No records found for ${selectedTab.replace('_', ' ')} status.`}
          iconType="document"
          showRefreshButton
          buttonText="Refresh Records"
          onButtonClick={refetch}
          className="py-16"
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
      <ToastContainer />
      <Header category="Page" title="Bank KYC Verification" />
      
      <div className="mb-4 flex items-center justify-between">
        <SearchBox
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by Name or UserId"
        />
        <ExportCSVButton
          exportHook={useLazyExportBankKycRecordsQuery}
          currentFilters={{
            search: debouncedSearchTerm,
            type: getTypeFromTab(selectedTab),
          }}
          filename="bank-kyc-records.csv"
          buttonText="Export to CSV"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-start gap-4 p-2">
          {['pending', 'approved', 'rejected', 'on_hold'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`capitalize w-[200px] py-3 text-sm font-medium rounded-lg transition-all ${
                selectedTab === tab ? 'bg-blue-500 text-white shadow-md' : 'border border-blue-500 text-blue-500 hover:bg-blue-50'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

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
                BANK KYC ID
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
                field="account_number"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Account Number
              </SortableTableHeader>
              <SortableTableHeader
                field="holder_name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Holder Name
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
                field="account_status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Status
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {debouncedSearchTerm ? 'No records match your search criteria.' : 'No records available.'}
                </td>
              </tr>
            ) : (
              filteredData.map((user, index) => (
                <tr 
                  key={user.user_id} 
                  className={`${
                    currentMode === "Dark" 
                      ? "bg-gradient-to-r from-black via-slate-900 to-black hover:bg-slate-800/30" 
                      : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      currentMode === "Dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.relevantBankDetail?.id || "-"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {user.relevantBankDetail?.userId || "-"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {user.relevantBankDetail?.account_number || "-"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {user.relevantBankDetail?.holder_name || "-"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {formatDate(user.relevantBankDetail?.createdAt)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      currentMode === "Dark" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusClasses(user.relevantBankDetail?.account_status)}`}>
                      {user.relevantBankDetail?.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => openModal(user)}
                      className={`px-4 py-2 flex items-center gap-2 rounded-full transition-colors ${
                        currentMode === "Dark"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                      }`}
                    >
                      <FaEye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalRecords={totalRecords}
        backendLimit={backendLimit}
        recordsCount={bankKycRecords.length}
      />

      {filteredData.length === 0 && debouncedSearchTerm && (
        <EmptyState
          title="No Bank KYC Records Found"
          message="No records match your search criteria. Try adjusting your search terms."
          iconType="document"
          showRefreshButton
          buttonText="Refresh Bank KYC Records"
          className="py-16"
        />
      )}
      
       <BankDetailModal
         isOpen={isModalOpen}
         selectedUser={selectedUser}
         isEditable={isEditable}
         editedDetails={editedDetails}
         isUpdatingBankDetails={isUpdatingBankDetails}
         isSendingReminder={isSendingReminder}
         onClose={closeModal}
         onInputChange={handleInputChange}
         onEditClick={handleEditClick}
         onSaveChanges={handleSaveChanges}
         onCancelEdit={handleCancelEdit}
         onUpdateKycStatus={handleUpdateKycStatus}
         onSendReminder={handleSendReminder}
         onReasonModalOpen={(kycId) => {
           setSelectedKycId(kycId);
           setIsReasonModalOpen(true);
         }}
         transformDocumentUrl={transformDocumentUrl}
       />

      <ReasonModal
        isOpen={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        onConfirm={handleReasonConfirm}
        userId={selectedUser?.user_id}
        bankId={selectedUser?.allBankDetails[0]?.id}
        title="Select Reason for Hold"
      />
    </div>
  );
};

export default BankVerification;