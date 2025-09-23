import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BsBank } from "react-icons/bs";
import { FiHash, FiCreditCard, FiKey, FiMapPin } from "react-icons/fi";
import { Header, EmptyState } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import { useGetBankInfoQuery } from "../../redux/slices/bankinfo/bankinfoApi";

const InfoTile = ({ icon: Icon, label, value, isMonospace = false }) => {
  const textClass = isMonospace ? "font-mono" : "";
  return (
    <div className="space-y-2">
      {/* Icon and Label */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <Icon className="text-lg" />
        </div>
        <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {label}
        </span>
      </div>
      
      {/* Input Field Style Display */}
      <div className="relative">
        <div
          className={`w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 ${textClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        >
          {value || "—"}
        </div>
      </div>
    </div>
  );
};

const BankInfoPage = () => {
  const { currentMode } = useStateContext();
  const { bankinfo = {}, loading: isLoading, error } = useSelector((state) => state.bankinfo);
  const { isFetching } = useGetBankInfoQuery();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (bankinfo && Object.keys(bankinfo).length > 0 || error) {
      setIsInitialLoad(false);
    }
  }, [bankinfo, error]);

  // Console log to check slice data (only when data changes)
  useEffect(() => {
    console.log("🔍 BankInfo Slice Data:", {
      bankinfo: bankinfo,
      isLoading: isLoading,
      error: error,
      isInitialLoad: isInitialLoad
    });
  }, [bankinfo, isLoading, error, isInitialLoad]);

  const bankList = bankinfo && Array.isArray(bankinfo) ? bankinfo : [];

  // Show loading state - handle all loading scenarios
  if (isLoading || isFetching || (isInitialLoad && !error)) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 border-1 border-blue-300 shadow-lg rounded-3xl">
        <Header category="Page" title="Bank Information" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10">
        <Header category="Page" title="Bank Information" />
        <EmptyState
          title="Unable to Load Bank Info"
          message="We encountered an issue while loading the bank information. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
          variant="error"
        />
      </div>
    );
  }

  // Only show empty state if we're not loading, have no data, no error, and initial load is complete
  if (bankList.length === 0 && !isLoading && !isFetching && !error && !isInitialLoad) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10">
        <Header category="Page" title="Bank Information" />
        <EmptyState
          title="No Bank Information Found"
          message="Bank information records will appear here once they are added to the system."
          iconType="document"
        />
      </div>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 border-1 border-blue-300 shadow-lg rounded-3xl">
      <Header category="Page" title="Bank Information" />

      {bankList.map((info) => (
        <div key={info.id} className="mb-8">
          {/* Account Details Section */}
          <div className="mt-6">
            <div className="bg-blue-600 px-4 py-3 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-white">
                Account Details
              </h2>
            </div>
            
            {/* Form-style grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <InfoTile icon={FiCreditCard} label="Account Type" value={info.account_type} />
              <InfoTile icon={FiHash} label="Account Name" value={info.account_name} isMonospace />
              <InfoTile icon={FiHash} label="Account Number" value={info.account_no} isMonospace />
              <InfoTile icon={FiKey} label="SWIFT Code" value={info.swift_code} isMonospace />
              <InfoTile icon={FiKey} label="IBAN" value={info.iban} isMonospace />
              <InfoTile icon={FiMapPin} label="Address" value={info.address} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BankInfoPage;
