import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaCheckCircle, FaArrowUp, FaInbox, FaSyncAlt } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';

import FullScreenLoader from '../../components/FullScreenLoader';
import CoinLoader from '../../components/CoinLoader';
import Pagination from '../../components/Pagination'; // Ensure this path is correct
import {
  useGetWalletQuery,
  useUploadWalletEodMutation,
  useUpdateWalletEodMutation,
} from '../../redux/slices/wallet/walletApi';
import { useSelector } from 'react-redux';

const WalletPage = () => {
  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedColumn, setSelectedColumn] = useState('id');
  const [activeStatus, setActiveStatus] = useState('pending');

  const uploadCSVRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- RTK QUERY HOOK ---
  const {
    data,
    isLoading: isInitialLoading,
    isFetching,
    refetch,
  } = useGetWalletQuery({
    page: currentPage,
    search: debouncedSearchTerm,
    status: activeStatus,
    limit: 10, // You can make this a state variable if you want a page size selector
  });

  // Extract data and metadata from the transformed response
  const transactions = data?.transactions || [];
  const meta = data?.meta || {};

  const [uploadWalletEod, { isLoading: isUploading }] = useUploadWalletEodMutation();
  const [updateWalletEod, { isLoading: isUpdatingStatus }] = useUpdateWalletEodMutation();

  // --- CLIENT-SIDE SORTING ---
  // Sorts the data for the *current page*
  const sortedTransactions = useMemo(() => {
    // Create a mutable copy before sorting
    return [...transactions].sort((a, b) => {
      const valA = a[selectedColumn] || '';
      const valB = b[selectedColumn] || '';

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, selectedColumn, sortOrder]);

  // --- EVENT HANDLERS ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSort = (column) => {
    if (selectedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSelectedColumn(column);
      setSortOrder('asc');
    }
  };

  const handleTabChange = (tab) => {
    setActiveStatus(tab);
    setCurrentPage(1); // Reset to first page on tab change
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
    toast.info('Refreshing data...');
  };

  const addFunds = async (id, status) => {
    try {
      await updateWalletEod({ id, status }).unwrap();
      toast.success(`Transaction has been ${status}.`);
      // RTK Query's 'invalidatesTags' will handle the refetch automatically.
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.data?.message || 'Failed to update status.');
    }
  };
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        if (!result.data.length) {
          return toast.warn("CSV file is empty or invalid.");
        }
        try {
          await uploadWalletEod({ transactions: result.data }).unwrap();
          toast.success('File uploaded and is processing.');
          // RTK Query's 'invalidatesTags' will refetch the data.
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error(error.data?.message || 'Error uploading file.');
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast.error('Error parsing CSV file.');
      },
    });
    event.target.value = null; // Clear the input for re-uploading the same file
  };
  
  const exportToCSV = () => {
    if (!sortedTransactions.length) return toast.warn('No data to export.');

    const csv = Papa.unparse(sortedTransactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `wallet-${activeStatus}-page-${currentPage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Current page exported successfully!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Approved</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Pending</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };
  
  if (isInitialLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 text-gray-900 min-h-screen font-sans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Wallet Transactions
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isFetching || !transactions.length}
          >
            Export Page
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
            disabled={isFetching}
          >
            <FaSyncAlt className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
          <input type="file" id="file-upload" accept=".csv" className="hidden" ref={uploadCSVRef} onChange={handleFileUpload} />
          <button
            type="button"
            onClick={() => uploadCSVRef.current.click()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2 disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : <><FaArrowUp /> Upload EOD File</>}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Name or Reference..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button onClick={() => handleTabChange('pending')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeStatus === 'pending' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Pending
              </button>
              <button onClick={() => handleTabChange('approved')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeStatus === 'approved' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Approved
              </button>
              <button onClick={() => handleTabChange('rejected')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeStatus === 'rejected' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Rejected
              </button>
          </nav>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        {isFetching ? (
            <div className="flex justify-center items-center py-20"><CoinLoader /></div>
        ) : sortedTransactions.length === 0 ? (
            <div className="text-center py-20 px-4">
                <FaInbox className="mx-auto w-12 h-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Transactions Found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    {debouncedSearchTerm ? 'No results match your search query.' : `There are no ${activeStatus} transactions.`}
                </p>
            </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th onClick={() => handleSort('id')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer">
                  Trans. ID {selectedColumn === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('referenceNo')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer">
                  Nuqi. ID {selectedColumn === 'referenceNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('portfolioName')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer">
                  Username {selectedColumn === 'portfolioName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTransactions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.referenceNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.portfolioName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.transactionType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(item.transactionDate).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-semibold">
                    {item.amountCredited} <span className="text-gray-500 font-normal">{item.currency}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center gap-2">
                      {(userRole === "admin" || userRole === "superadmin") && item.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => addFunds(item.id, 'approved')}
                            disabled={isUpdatingStatus}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => addFunds(item.id, 'rejected')}
                            disabled={isUpdatingStatus}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {item.status === 'approved' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <FaCheckCircle />
                          <span className="text-xs font-bold">Approved</span>
                        </div>
                      )}
                      {item.status === 'rejected' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <FcCancel />
                          <span className="text-xs font-bold">Rejected</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- PAGINATION COMPONENT --- */}
      {meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default WalletPage;