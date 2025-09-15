import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useStateContext } from "../contexts/ContextProvider";
import { useGetAnalysisPortfoliosQuery, useGetCompanyConfigQuery, useGetCashDetailsQuery } from "../redux/slices/allusers/allusersApi";

const StatCard = ({ title, value, accent = "" }) => (
  <div className="flex-1 min-w-[200px] border rounded-xl p-4 dark:border-gray-700 border-gray-200">
    <div className="text-xs uppercase tracking-widest mb-2 text-gray-500 dark:text-gray-300">{title}</div>
    <div className={`text-lg font-semibold ${accent}`}>{value}</div>
  </div>
);

const Pill = ({ label }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/40 text-emerald-300 border border-emerald-700/40">
    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
    {label}
  </span>
);

const sliceString = (str, maxLength = 800) => (str?.length > maxLength ? `${str.slice(0, maxLength)}...` : str);

const AnalysisCard = ({ title, node, desc, borderClass, onCardClick }) => {
  const invested = Number(node?.overall?.investedAmount || 0);
  const currentValue = Number(node?.overall?.currentValue || 0);
  const pnl = Number(node?.overall?.pnl || 0);
  const pct = Number(node?.overall?.pnlPctChange || 0);

  return (
    <div 
      className={`rounded-xl border ${borderClass} p-4 bg-[#0B1120] w-full cursor-pointer hover:border-cyan-500 transition-colors`}
      onClick={() => onCardClick(title)}
    >
      <div className="text-base font-semibold mb-4">{title}</div>
      {invested <= 0 ? (
        <div className="text-sm text-gray-300">{sliceString(desc) || "No positions yet."}</div>
      ) : (
        <div className="flex flex-col">
          {/* Metrics */}
          <div className="flex flex-col space-y-4">
            {/* Invested */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Invested Amount</div>
              <div className="text-base">USD {invested.toFixed(2)}</div>
            </div>
            {/* Current Value */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Current Value</div>
              <div className={`flex items-center text-base ${currentValue >= invested ? "text-emerald-400" : "text-red-400"}`}>
                USD {currentValue.toFixed(2)}
                <span className="ml-1">{currentValue >= invested ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}</span>
              </div>
            </div>
            {/* P&L */}
            <div>
              <div className="text-xs text-gray-400 mb-1">P & L</div>
              <div className="flex items-center gap-2">
                <span className="text-base">USD {pnl.toFixed(2)}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${pct >= 0 ? "bg-green-600" : "bg-red-500"}`}>
                  {pct.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GetAllPortfolios = ({ record, onClose }) => {
  const navigate = useNavigate();
  const { currentMode } = useStateContext();
  const [selectedCurrency, setSelectedCurrency] = React.useState('overall');
  const dataBlock = record?.[selectedCurrency] || record?.overall || { investedAmount: 0, currentValue: 0, pnl: 0, pnlPctChange: 0 };

  const containerBg = currentMode === "Dark" ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100" : "bg-white";
  const borderClass = currentMode === "Dark" ? "border-gray-700" : "border-gray-200";

  // Analysis + Config via RTK Query
  const userId = record?.user?.id;
  const { data: cfgData } = useGetCompanyConfigQuery();
  const { data: analysisData } = useGetAnalysisPortfoliosQuery({ userId }, { skip: !userId });
  const { data: cashData } = useGetCashDetailsQuery({ userId }, { skip: !userId });
  const cfg = cfgData?.data || {};
  const analysis = analysisData?.analysis || {};
  
  // Get currency flags from cash details
  const currencyToFlag = new Map(
    (cashData?.data || []).map((c) => [String(c?.currency).toUpperCase(), c?.fx?.image_url])
  );

  return (
    <div className={`rounded-2xl w-full ${containerBg} border ${borderClass} shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b dark:border-gray-800 border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{record?.user?.customer_number || record?.user?.id || "Portfolio"} Portfolio</h2>
          <Pill label="Ethical" />
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none" aria-label="Close">×</button>
      </div>

      {/* Currency toggles */}
      <div className="px-6 pt-4 flex items-center gap-2">
        {Object.keys(record || {})
          .filter((key) => key !== 'user')
          .map((currency) => (
            <button
              key={currency}
              type="button"
              onClick={() => setSelectedCurrency(currency)}
              className={`uppercase flex items-center py-2 px-4 rounded-full text-sm transition-colors border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black ${
                selectedCurrency === currency ? 'ring-1 ring-cyan-500/40 text-cyan-300' : ''
              }`}
            >
              {currency !== 'overall' && currencyToFlag.get(currency) && (
                <img
                  src={currencyToFlag.get(currency)}
                  alt={currency}
                  className="w-4 h-4 mr-2 rounded-full"
                />
              )}
              {currency}
            </button>
          ))}
        <button 
          type="button" 
          onClick={() => navigate(`/admin/portfolios/${userId}/transactions`)}
          className="ml-auto text-sm text-cyan-400 hover:underline"
        >
          Order Book
        </button>
      </div>

      {/* Main content */}
      <div className="px-6 pt-4 pb-6">
        {/* Stats row */}
        <div className="pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard 
            title="Invested Amount" 
            value={`${selectedCurrency === 'overall' ? 'USD' : selectedCurrency} ${dataBlock.investedAmount.toFixed?.(2) || Number(dataBlock.investedAmount).toFixed(2)}`} 
          />
          <StatCard 
            title="Current Value" 
            value={`${selectedCurrency === 'overall' ? 'USD' : selectedCurrency} ${dataBlock.currentValue.toFixed?.(2) || Number(dataBlock.currentValue).toFixed(2)}`} 
          />
          <StatCard 
            title="P&L (Value)" 
            value={`${selectedCurrency === 'overall' ? 'USD' : selectedCurrency} ${dataBlock.pnl.toFixed?.(2) || Number(dataBlock.pnl).toFixed(2)}`} 
            accent={dataBlock.pnl >= 0 ? "text-emerald-400" : "text-red-400"} 
          />
          <StatCard 
            title="P&L (%)" 
            value={`${(dataBlock.pnlPctChange ?? 0).toFixed(2)}%`} 
            accent={(dataBlock.pnlPctChange ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"} 
          />
        </div>

        {/* Portfolio Analysis - fed by RTK Query */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalysisCard 
              title="Equity" 
              node={analysis?.EQUITY} 
              desc={cfg?.portfolio_equity_desc} 
              borderClass={borderClass}
              userId={userId}
              onCardClick={(type) => navigate('/portfolioanalysisdetails', { state: { portfolioType: type, userId } })}
            />
            <AnalysisCard 
              title="ETF" 
              node={analysis?.ETF} 
              desc={cfg?.portfolio_etf_desc} 
              borderClass={borderClass}
              userId={userId}
              onCardClick={(type) => navigate('/portfolioanalysisdetails', { state: { portfolioType: type, userId } })}
            />
            <AnalysisCard 
              title="Mutual Funds" 
              node={analysis?.MF} 
              desc={cfg?.portfolio_mf_desc} 
              borderClass={borderClass}
              userId={userId}
              onCardClick={(type) => navigate('/portfolioanalysisdetails', { state: { portfolioType: type, userId } })}
            />
            <AnalysisCard 
              title="CEP" 
              node={analysis?.CEP} 
              desc={cfg?.portfolio_cep_desc} 
              borderClass={borderClass}
              userId={userId}
              onCardClick={(type) => navigate('/portfolioanalysisdetails', { state: { portfolioType: type, userId } })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllPortfolios;