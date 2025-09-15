import React from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useGetCashDetailsQuery } from '../redux/slices/allusers/allusersApi';

const COLORS = ['#0DD3FF', '#0993B3', '#065B6F', '#0BAFD4', '#065B6c'];

// Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0];
    return (
      <div className="p-2 bg-black text-white rounded-lg text-xs">
        <p>{name}</p>
        <p>USD {Number(value).toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

// Label component for pie chart
const renderCustomizedLabel = (labelProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, name, value, totalInvestedAmount } = labelProps;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const pct = ((value / totalInvestedAmount) * 100)?.toFixed(2);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize="10"
      fontWeight="bold"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${name} (${pct}%)`}
    </text>
  );
};

const PortfolioAnalysisLeft = ({
  tabs,
  activeTab,
  setActiveTab,
  selectedCurrency,
  setSelectedCurrency,
  analysisData,
  showChartOnly = false,
  userId,
}) => {
  if (!analysisData) return null;

  const selectedAnalysis = activeTab?.toUpperCase();
  const selectedAnalysisData = analysisData?.[selectedAnalysis] || {};
  const portfolio = selectedAnalysisData[selectedCurrency] || selectedAnalysisData.overall || {};

  const {
    investedAmount: totalInvestedAmount = 0,
    stocks = [],
    baskets = [],
    pnl = 0,
    pnlPctChange = 0,
    investedAmount = 0,
    investedAmountOG = 0,
    currentValue = 0,
    currentValueOG = 0,
  } = portfolio;

  const isPositive = (val) => Number(val) >= 0;

  const processPieData = (data, total, isCEP = false) => {
    const sorted = [...data].sort((a, b) => b.investedAmount - a.investedAmount);
    const top = sorted.slice(0, 4);
    const others = sorted.slice(4).reduce((sum, i) => sum + i.investedAmount, 0);
    const chart = top.map((item) => ({
      name: item.key || (isCEP ? item.basketName : item.stockName),
      value: parseFloat(item.investedAmount),
    }));
    if (others > 0) {
      chart.push({ name: 'Others', value: parseFloat(others) });
    }
    return chart;
  };

  const pieData = processPieData(stocks, totalInvestedAmount);
  const pieDataCEP = processPieData(baskets, totalInvestedAmount, true);

  const currencies = Object.keys(selectedAnalysisData);
  // fetch flags from cash details (same API used in MyFundsPanel)
  const { data: cashData } = useGetCashDetailsQuery({ userId }, { skip: !userId });
  const currencyToFlag = new Map(
    (cashData?.data || []).map((c) => [String(c?.currency).toUpperCase(), c?.fx?.image_url])
  );

  return (
    <div className="w-full rounded-lg">
      {!showChartOnly && (
        <>
          <h3 className="text-lg font-semibold mb-4">{activeTab} Analysis</h3>
          {/* Tabs */}
          <div className="flex items-center gap-10 mb-5 text-white uppercase rounded-full text-sm">
            {tabs.map((tab, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-lg ${activeTab === tab ? 'text-cyan-400 font-semibold' : 'text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Currency Selector */}
          <div className="flex gap-2 mb-5">
            {currencies.map((currency) => (
              <button
                key={currency}
                type="button"
                className={`uppercase flex items-center py-2 px-4 rounded-full text-sm transition-colors border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black ${
                  selectedCurrency === currency ? 'ring-1 ring-cyan-500/40 text-cyan-300' : 'text-white'
                }`}
                onClick={() => setSelectedCurrency(currency)}
              >
                {currencyToFlag.get(String(currency).toUpperCase()) ? (
                  <img
                    src={currencyToFlag.get(String(currency).toUpperCase())}
                    alt={currency}
                    className="w-4 h-4 mr-2 rounded-full"
                  />
                ) : null}
                {currency}
              </button>
            ))}
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 text-white gap-4">
            <div className="rounded-lg py-3 px-4 border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black">
              <div className="text-xs mb-2">Invested Amount</div>
              <div className="text-lg">
                {selectedCurrency === 'overall' ? 'USD' : selectedCurrency}{' '}
                {Number(selectedCurrency === 'overall' ? investedAmount : investedAmountOG || 0).toFixed(2)}
              </div>
            </div>

            <div className="rounded-lg py-3 px-4 border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black">
              <div className="text-xs mb-2">Current Value</div>
              <div className="text-lg">
                {selectedCurrency === 'overall' ? 'USD' : selectedCurrency}{' '}
                {Number(selectedCurrency === 'overall' ? currentValue : currentValueOG || 0).toFixed(2)}
              </div>
            </div>

            <div className="rounded-lg py-3 px-4 flex justify-between border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black">
              <div>
                <div className="text-xs mb-2">P&L (Value)</div>
                <div className={`text-lg ${isPositive(pnl) ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedCurrency === 'overall' ? 'USD' : selectedCurrency} {Number(pnl || 0).toFixed(2)}
                </div>
              </div>
              {isPositive(pnl) ? (
                <FaArrowUp size={24} className="text-green-500" />
              ) : (
                <FaArrowDown size={24} className="text-red-500" />
              )}
            </div>

            <div className="rounded-lg py-3 px-4 flex justify-between border border-gray-700/60 bg-gradient-to-br from-black via-slate-900 to-black">
              <div>
                <div className="text-xs mb-2">P&L (%)</div>
                <div className={`text-lg ${isPositive(pnlPctChange) ? 'text-green-500' : 'text-red-500'}`}>
                  {Number(pnlPctChange || 0).toFixed(2)}%
                </div>
              </div>
              {isPositive(pnlPctChange) ? (
                <FaArrowUp size={24} className="text-green-500" />
              ) : (
                <FaArrowDown size={24} className="text-red-500" />
              )}
            </div>
          </div>

          <div className="text-gray-400 mt-4 text-xs">*Reporting Currency in USD</div>
        </>
      )}

      {/* Pie Chart */}
      {showChartOnly && (
        <>
          <h3 className="text-lg font-semibold mb-4">{activeTab} Distribution</h3>
          <div className="flex justify-center text-white items-center">
            <ResponsiveContainer maxHeight={300} width="100%" aspect={1}>
              <PieChart>
                <Pie
                  data={activeTab === 'CEP' ? pieDataCEP : pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  color="white"
                  outerRadius={90}
                  innerRadius={70}
                  label={(props) => renderCustomizedLabel({ ...props, totalInvestedAmount })}
                >
                  {(activeTab === 'CEP' ? pieDataCEP : pieData).map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                      stroke={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioAnalysisLeft;