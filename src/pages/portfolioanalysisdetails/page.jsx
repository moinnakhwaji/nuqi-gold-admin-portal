import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAnalysisPortfoliosQuery } from '../../redux/slices/allusers/allusersApi';
import PortfolioAnalysisLeft from '../../components/PortfolioAnalysisLeft';
import PortfolioAnalysisRight from '../../components/PortfolioAnalysisRight';

const TABS = ['Equity', 'CEP', 'ETF', 'MF'];

const PortfolioAnalysisDetails = () => {
  const location = useLocation();
  const { portfolioType = 'Equity', userId } = location.state || {};
  const [activeTab, setActiveTab] = useState(portfolioType);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Fetch portfolio analysis data using RTK Query
  const { data: analysisData, isLoading, error } = useGetAnalysisPortfoliosQuery(
    { userId },
    { skip: !userId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white p-6">
        <div className="text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg p-4">
          Failed to load portfolio details. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black p-6 shadow-xl">
          <PortfolioAnalysisLeft
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            analysisData={analysisData?.analysis}
            userId={userId}
            showChartOnly={false}
          />
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black p-6 shadow-xl">
          <PortfolioAnalysisLeft
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            analysisData={analysisData?.analysis}
            userId={userId}
            showChartOnly
          />
        </div>
      </div>

      {/* Details below full width */}
      <div className="mt-6 rounded-2xl border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black p-6 shadow-xl">
        <PortfolioAnalysisRight
          activeTab={activeTab}
          selectedCurrency={selectedCurrency}
          analysisData={analysisData?.analysis}
        />
      </div>
    </div>
  );
};

export default PortfolioAnalysisDetails;