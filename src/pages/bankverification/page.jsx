import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaBell } from 'react-icons/fa';
import {
  useGetBankKycQuery,
  useUpdateBankDetailsMutation,
  useUpdateKycRecordStatusMutation,
  useGetOnHoldBankKycMutation,
} from '../../redux/slices/Bankverification/bankverificationapi';
import FullScreenLoader from '../../components/FullScreenLoader';
import ReasonModal from '../../components/ReasonModal';
import { parse } from '../../lib/utils';

// Column definitions for the main data table
const columns = [
  { id: 'id', label: 'BANK KYC ID', minWidth: '170px' },
  { id: 'user_id', label: 'User ID', minWidth: '100px' },
  { id: 'account_number', label: 'Account Number', minWidth: '150px' },
  { id: 'holder_name', label: 'Holder Name', minWidth: '150px' },
  { id: 'createdAt', label: 'Created At', minWidth: '120px' },
  { id: 'status', label: 'Status', minWidth: '120px' },
  { id: 'actions', label: 'Actions', minWidth: '100px' },
];

// Helper to determine tailwind classes based on KYC status
const getStatusClasses = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border border-red-300';
    case 'ON_HOLD':
      return 'bg-orange-100 text-orange-800 border border-orange-300';
    default:
      return 'bg-amber-100 text-amber-800 border border-amber-300';
  }
};

const BankVerification = () => {
  // RTK Query hooks for data fetching and mutations
  const { data: bankKycData, error, isLoading, isFetching, refetch } = useGetBankKycQuery();
  const [updateBankDetails, { isLoading: isUpdatingBankDetails }] = useUpdateBankDetailsMutation();
  const [updateKycRecordStatus] = useUpdateKycRecordStatusMutation();
  const [getOnHoldBankKyc, { isLoading: isSendingReminder }] = useGetOnHoldBankKycMutation();

  // Component state management
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedKycId, setSelectedKycId] = useState(null);

  // Processes raw data to find the most relevant bank detail for display in the table
  const processDataWithRelevantDetails = (dataToProcess = []) => {
    return dataToProcess.map((user) => {
      const sortedBankDetails = [...(user.bankDetails || [])].sort((a, b) => {
        if (a.account_status === 'PENDING' && b.account_status !== 'PENDING') return 1;
        if (b.account_status === 'PENDING' && a.account_status !== 'PENDING') return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return {
        ...user,
        relevantBankDetail: sortedBankDetails[0],
        allBankDetails: sortedBankDetails,
      };
    });
  };

  // Effect to filter and sort data when RTK Query data, tab, or search term changes
  useEffect(() => {
    if (bankKycData) {
      const allData = bankKycData.data || [];
      const processedData = processDataWithRelevantDetails(allData);

      const filterByTab = (data) => {
        return data.filter((user) => {
          const status = user.relevantBankDetail?.account_status?.toUpperCase();
          switch (selectedTab) {
            case 'approved': return status === 'APPROVED';
            case 'rejected': return status === 'REJECTED';
            case 'on_hold': return status === 'ON_HOLD';
            default: return status === 'UNDER_REVIEW';
          }
        });
      };
      const tabFilteredData = filterByTab(processedData);

      if (searchTerm) {
        const searchFiltered = tabFilteredData.filter((user) => {
          const detail = user.relevantBankDetail;
          return (
            detail?.holder_name?.toLowerCase().includes(searchTerm) ||
            detail?.user_id?.toLowerCase().includes(searchTerm) ||
            detail?.account_number?.toLowerCase().includes(searchTerm)
          );
        });
        setFilteredData(searchFiltered);
      } else {
        setFilteredData(tabFilteredData);
      }
    }
  }, [bankKycData, selectedTab, searchTerm]);

  // Effect to show toast notifications on API errors
  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch KYC data.');
      console.error('Error fetching KYC data:', error);
    }
  }, [error]);

  const handleTabChange = (tab) => setSelectedTab(tab);
  const handleSearch = (event) => setSearchTerm(event.target.value.toLowerCase());

  const openModal = (user) => {
    if (!user || !Array.isArray(user.bankDetails) || user.bankDetails.length === 0) {
      toast.error('This user has no bank details to view.');
      return;
    }
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  console.log("selected user", selectedUser);
  console.log("all bank details", {
    userId: selectedUser?.user_id,
    bankId: selectedUser?.allBankDetails[0]?.id,
   
  });

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

  // Saves updated bank details using RTK Query mutation
  const handleSaveChanges = async (bankDetail) => {
    try {
      // FIX 2: Changed keys to snake_case
      const payload = {
        holder_name: editedDetails.holder_name,
        bank_name: editedDetails.bank_name,
        branch_name: editedDetails.branch_name,
        account_number: editedDetails.account_number,
        ifsc_code: editedDetails.ifsc_code,
        bank_id: bankDetail.id,
      };
      
      await updateBankDetails({ user_id: bankDetail.user_id, body: payload }).unwrap();
      
      toast.success('Bank details updated successfully');
      closeModal(); // RTK Query's cache invalidation will trigger a refetch
    } catch (err) {
      console.error('Error updating bank details:', err);
      toast.error(err.data?.message || 'Failed to update bank details');
    }
  };

  // Updates KYC status using RTK Query mutation
  const handleUpdateKycStatus = async (status, id, reason = null) => {
    try {
      // FIX 1: Convert status to lowercase
      const lowercaseStatus = status.toLowerCase();

      await updateKycRecordStatus({ id, status: lowercaseStatus, reason }).unwrap();
      
      toast.success(`KYC record has been updated to ${status}.`);
      closeModal();
      setIsReasonModalOpen(false);
    } catch (err) {
      console.error(`Error updating KYC status:`, err);
      toast.error(err.data?.message || `Failed to update KYC status.`);
    }
  };
  
  // Sends a reminder for 'On Hold' KYC using RTK Query mutation
  const handleSendReminder = async (bankDetail) => {
    try {
      await getOnHoldBankKyc(bankDetail.id).unwrap();
      toast.success('Reminder sent successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send reminder');
      console.error('Error sending reminder:', err);
    }
  };

  const handleSort = (columnId) => {
    const isAsc = selectedColumn === columnId && sortOrder === 'asc';
    const newSortOrder = isAsc ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setSelectedColumn(columnId);
    const sorted = [...filteredData].sort((a, b) => {
      let valA = a.relevantBankDetail?.[columnId];
      let valB = b.relevantBankDetail?.[columnId];
      if (valA < valB) return newSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredData(sorted);
  };
  
  const handleReasonConfirm = (reason) => {
    if (selectedKycId) {
      // Pass the original uppercase status for consistency in UI logic
      handleUpdateKycStatus('ON_HOLD', selectedKycId, reason);
    }
  };
  
  const convertTimestampToDays = (timestamp) => {
    if (!timestamp) return 'N/A';
    const diffDays = Math.floor((new Date() - new Date(timestamp)) / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const exportToCSV = () => {
    const rows = filteredData.map(user => ({
      user_id: user.relevantBankDetail?.user_id,
      holder_name: user.relevantBankDetail?.holder_name,
      account_number: user.relevantBankDetail?.account_number,
      account_status: user.relevantBankDetail?.account_status,
      createdAt: user.relevantBankDetail?.createdAt,
    }));
    try {
      const csv = parse(rows, { fields: ['user_id', 'holder_name', 'account_number', 'account_status', 'createdAt'] });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'kyc_data.csv';
      link.click();
      toast.success('CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV!');
      console.error('CSV Export Error:', err);
    }
  };

  const transformDocumentUrl = (url) => url?.replace(':7777/', ':7000/');

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-['Poppins']">
      {(isLoading || isFetching) && <FullScreenLoader />}
      <ToastContainer />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bank KYC Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={refetch} className="px-6 py-2 flex items-center gap-2 bg-white hover:bg-gray-100 rounded-lg border">
            Refresh
          </button>
          <button onClick={exportToCSV} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
            Export CSV
          </button>
        </div>
      </div>

      <div className="relative w-[500px] mb-6">
        <input
          type="text"
          placeholder="Search by Name, User Id, or Account Number"
          className="w-full px-4 py-3 bg-white rounded-lg border focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-start mb-4 gap-4 p-2">
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.id} className="p-4 bg-gray-100 text-left cursor-pointer" onClick={() => handleSort(col.id)}>
                    {col.label}
                    {selectedColumn === col.id && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan={columns.length} className="text-center py-12">No Records Available</td></tr>
              ) : (
                filteredData.map((user) => (
                  <tr key={user.user_id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{user.relevantBankDetail?.id}</td>
                    <td className="p-4">{user.relevantBankDetail?.user_id}</td>
                    <td className="p-4">{user.relevantBankDetail?.account_number || 'N/A'}</td>
                    <td className="p-4">{user.relevantBankDetail?.holder_name || 'N/A'}</td>
                    <td className="p-4">{convertTimestampToDays(user.relevantBankDetail?.createdAt)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusClasses(user.relevantBankDetail?.account_status)}`}>
                        {user.relevantBankDetail?.account_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => openModal(user)} className="px-4 py-2 flex items-center gap-2 bg-blue-100 hover:bg-blue-200 rounded-full">
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-3xl w-[90%] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4 text-center font-bold">
              Bank Details History - {selectedUser.user_id}
            </h2>
            {selectedUser.allBankDetails.map((detail, index) => {
                const kycRecord = selectedUser.kycRecords.find(kyc => kyc.BankId === detail.id);
                return (
                  <div key={detail.id} className={`mb-6 p-6 border rounded-lg ${index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-bold ${index === 0 ? 'text-blue-800' : ''}`}>{index === 0 ? 'Latest Record' : `Previous Record`}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                          <p className="text-sm text-gray-500 mb-1">Holder Name</p>
                          {index === 0 && isEditable ? <input name="holder_name" value={editedDetails.holder_name} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p>{detail.holder_name || 'N/A'}</p>}
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 mb-1">Account Number</p>
                          {index === 0 && isEditable ? <input name="account_number" value={editedDetails.account_number} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p>{detail.account_number || 'N/A'}</p>}
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                          {index === 0 && isEditable ? <input name="bank_name" value={editedDetails.bank_name} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p>{detail.bank_name || 'N/A'}</p>}
                      </div>
                       <div>
                          <p className="text-sm text-gray-500 mb-1">Branch Name</p>
                          {index === 0 && isEditable ? <input name="branch_name" value={editedDetails.branch_name} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p>{detail.branch_name || 'N/A'}</p>}
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 mb-1">IFSC/IBAN Code</p>
                          {index === 0 && isEditable ? <input name="ifsc_code" value={editedDetails.ifsc_code} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p>{detail.ifsc_code || 'N/A'}</p>}
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(detail.account_status)}`}>
                                {detail.account_status}
                           </span>
                      </div>
                    </div>
                    
                    {kycRecord && (
                      <div className="mt-8 pt-4 border-t">
                        <h4 className="mb-4 text-gray-500">KYC Document</h4>
                        <a href={transformDocumentUrl(kycRecord.proofdoc)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a>
                      </div>
                    )}

                    {index === 0 && (
                      <div className="mt-8 flex gap-2 justify-end">
                        {!isEditable ? (
                          <>
                            {detail.account_status === 'UNDER_REVIEW' && kycRecord && (
                                <>
                                    <button onClick={() => handleEditClick(detail)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Edit</button>
                                    <button onClick={() => { setSelectedKycId(kycRecord.id); setIsReasonModalOpen(true); }} className="px-4 py-2 bg-orange-500 text-white rounded-lg">On Hold</button>
                                    <button onClick={() => handleUpdateKycStatus('APPROVED', kycRecord.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg">Approve</button>
                                    <button onClick={() => handleUpdateKycStatus('REJECTED', kycRecord.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Reject</button>
                                </>
                            )}
                            {detail.account_status?.toLowerCase() === 'on_hold' && (
                                <button onClick={() => handleSendReminder(detail)} disabled={isSendingReminder} className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2">
                                    {isSendingReminder ? 'Sending...' : <><FaBell/> Send Reminder</>}
                                </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleSaveChanges(detail)} disabled={isUpdatingBankDetails} className="px-4 py-2 bg-green-500 text-white rounded-lg">{isUpdatingBankDetails ? 'Saving...' : 'Save'}</button>
                            <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
            })}
            <div className="mt-8 flex justify-end">
              <button onClick={closeModal} className="px-6 py-2 bg-gray-100 rounded-lg border">Close</button>
            </div>
          </div>
        </div>
      )}

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