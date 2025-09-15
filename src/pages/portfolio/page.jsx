import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import GetAllPortfolios from "../../components/GetAllPortfolios";
import MyFundsPanel from "../../components/MyFundsPanel";

const PortfolioPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentMode } = useStateContext();
  const record = location.state?.record || null;

  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
      : "bg-white shadow-lg";

  const userId = record?.user?.id;

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${containerBg}`}>
      <Header category="Page" title="Portfolio" />

      {!record ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="mb-4 text-sm text-gray-400">No portfolio selected.</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700"
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GetAllPortfolios record={record} onClose={() => navigate(-1)} />
          </div>
          <div className="lg:col-span-1">
            <MyFundsPanel userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
