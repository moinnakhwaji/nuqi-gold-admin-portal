import React from "react";
import { BsBank } from "react-icons/bs";
import { FiHash, FiCreditCard, FiKey, FiMapPin } from "react-icons/fi";
import { Header, EmptyState } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import { useGetBankInfoQuery } from "../../redux/slices/bankinfo/bankinfoApi";

const InfoTile = ({ icon: Icon, label, value, isMonospace = false }) => {
  const textClass = isMonospace ? "font-mono" : "";
  return (
    <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow bg-white border-gray-200 dark:bg-transparent dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-md bg-blue-50 dark:bg-cyan-400/10 dark:border dark:border-cyan-400/20 text-blue-700 dark:text-cyan-300">
          <Icon className="text-lg" />
        </div>
        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">
          {label}
        </span>
      </div>
      <div
        className={`text-sm font-semibold text-gray-900 dark:text-white break-words ${textClass}`}
      >
        {value || "—"}
      </div>
    </div>
  );
};

const BankInfoPage = () => {
  const { currentMode } = useStateContext();
  const { data, isLoading, error } = useGetBankInfoQuery();

  const bankList = data?.data ?? [];

  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
        <Header category="Page" title="Bank Information" />
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
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
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

  const headerBgClass =
    currentMode === "Dark"
      ? "bg-transparent border border-gray-700"
      : "bg-gradient-to-r from-blue-600 to-indigo-600";
  const headerChipBg =
    currentMode === "Dark" ? "bg-cyan-400/10" : "bg-white/20";

  return (
    <div
      className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
        currentMode === "Dark"
          ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
          : "bg-white shadow-lg"
      }`}
    >
      <Header category="Page" title="Bank Information" />

      {bankList.map((info) => (
        <div key={info.id} className="mb-10">
          {/* Bank card header */}
          <div className={`mt-6 rounded-2xl overflow-hidden shadow ${headerBgClass}`}>
            <div className="flex items-center gap-4 px-6 py-5 text-white">
              <div className={`p-3 rounded-full ${headerChipBg}`}>
                <BsBank className="text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm/5 opacity-90">Bank</div>
                <div className="text-xl font-semibold truncate">
                  {info.bank_name || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Details tiles */}
          <div className="mt-4">
            <div className="px-2 sm:px-0 mb-2">
              <h2
                className={`text-lg font-semibold ${
                  currentMode === "Dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Account Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
