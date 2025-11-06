import React, { useState, useEffect } from 'react';
import { FiUsers, FiCheckCircle, FiDollarSign, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useGetDashboardDataQuery, useGetTotalCountQuery, useGetUserGrowthQuery } from '../redux/slices/dashboard/dashboardApi';
import { useSelector } from 'react-redux';


const StatCard = ({ stat, isDark }) => (
  <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
                   rounded-xl p-6 border transition-all duration-200 hover:shadow-lg`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white mb-4`}>
          {stat.icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stat.amount}
            </span>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {stat.title}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const DateRangeSelector = ({ selectedRange, onRangeChange, isDark, customStartDate, customEndDate, onCustomDateChange }) => {
  const ranges = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Custom', value: 'custom' }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <FiCalendar className={isDark ? 'text-gray-400' : 'text-gray-600'} />
        <div className="flex items-center space-x-2 flex-wrap">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => onRangeChange(range.value)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                selectedRange === range.value
                  ? 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {selectedRange === 'custom' && (
        <div className="flex items-center space-x-3 ml-6">
          <div className="flex items-center space-x-2">
            <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomDateChange('start', e.target.value)}
              className={`px-2 py-1 text-xs rounded border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-300'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomDateChange('end', e.target.value)}
              className={`px-2 py-1 text-xs rounded border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-300'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Ecommerce = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedRange, setSelectedRange] = useState('monthly');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // API queries
  const { data, isLoading, error } = useGetDashboardDataQuery();
  const { data: totalCountData, isLoading: totalCountLoading } = useGetTotalCountQuery();
  console.log(totalCountData, "total count data");

  // Build query params for user growth
  const userGrowthParams = selectedRange === 'custom' && customStartDate && customEndDate
    ? { range: selectedRange, startDate: customStartDate, endDate: customEndDate }
    : { range: selectedRange };

  const { data: userGrowthData, isLoading: userGrowthLoading } = useGetUserGrowthQuery(userGrowthParams);

  console.log(userGrowthData, "user growth data");

  console.log(data, "dashboard data");
  console.log(totalCountData, "total count data");
  console.log(userGrowthData, "user growth data");

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    if (range !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const handleCustomDateChange = (type, value) => {
    if (type === 'start') {
      setCustomStartDate(value);
    } else {
      setCustomEndDate(value);
    }
  }; 

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading dashboard data</div>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const apiData = data?.data || {};
  const totalCount = totalCountData?.data || {};
  console.log(apiData, "apiData");

  // Transform API data to match component structure
  const dashboardStats = [
    {
      title: "Total Users",
      amount: apiData.totalUsers?.toString() || "0",
      icon: <FiUsers />,
      color: "bg-purple-500"
    },
    {
      title: "Child Users",
      amount: totalCount.totalChildAccounts?.toString() || "0",
      icon: <FiUsers />,
      color: "bg-pink-500"
    },
    {
      title: "Parent Users",
      amount: totalCount.totalParentAccounts?.toString() || "0",
      icon: <FiUsers />,
      color: "bg-cyan-500"
    },
    {
      title: "KYC Verified Users",
      amount: apiData.kyc?.toString() || "0",
      icon: <FiCheckCircle />,
      color: "bg-blue-500"
    },
    {
      title: "Total Investment",
      amount: `AED ${parseFloat(apiData.total_investment_amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      icon: <FiDollarSign />,
      color: "bg-green-500"
    },
    {
      title: "Total Wallet Amount",
      amount: `AED ${parseFloat(apiData.total_wallet_amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      icon: <FiCreditCard />,
      color: "bg-indigo-500"
    }
  ];

  // Create chart data for investments
  const investmentChartData = [
    { name: 'Lumpsum', value: parseFloat(apiData.lumsum || 0), color: '#8B5CF6' },
    { name: 'SIP', value: parseFloat(apiData.sip || 0), color: '#06D6A0' }
  ];

  // Create chart data for gold
  const goldChartData = [
    { name: 'Lumpsum Gold', value: parseFloat(apiData.Lumsum_Gold || 0), color: '#FFD700' },
    { name: 'SIP Gold', value: parseFloat(apiData.SIP_Gold || 0), color: '#FFA500' },
    { name: 'Gold Sold', value: parseFloat(apiData.total_gold_sold || 0), color: '#FF6B6B' }
  ];

  // User growth chart data from API
  const userGrowthChartData = userGrowthData?.data?.userGrowth || [];
  console.log(userGrowthChartData, "userGrowthChartData");

  // Top metrics for display
  const topMetrics = [
    { label: "Total Gold", value: `${parseFloat(apiData.total_gold || 0).toFixed(4)} g` },
    { label: "Gold Buy Value", value: `AED ${parseFloat(apiData.total_gold_buy || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
    { label: "Transaction Amount", value: `AED ${parseFloat(apiData.total_transaction_amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
    { label: "Gold Sold", value: `${parseFloat(apiData.total_gold_sold || 0).toFixed(4)} g` }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            type="button"
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Today</span>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} stat={stat} isDark={isDark} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth Trend Chart */}
        <div className={`col-span-2 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
                         rounded-xl p-6 border`}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4">User Growth Trend</h3>
            <DateRangeSelector
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
              isDark={isDark}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDateChange={handleCustomDateChange}
            />
          </div>

          {userGrowthLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : userGrowthChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      color: isDark ? '#F9FAFB' : '#111827'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No data available for selected range
              </p>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
                         rounded-xl p-6 border`}
        >
          <h3 className="text-lg font-semibold mb-6">Key Metrics</h3>
          <div className="space-y-4">
            {topMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</span>
                <span className="font-medium text-sm">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Breakdown */}
        <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
                         rounded-xl p-6 border`}
        >
          <h3 className="text-lg font-semibold mb-6">Investment Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investmentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `AED ${value / 1000}K`}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gold Portfolio */}
        <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
                         rounded-xl p-6 border`}
        >
          <h3 className="text-lg font-semibold mb-6">Gold Portfolio Distribution</h3>
          <div className="flex items-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={goldChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {goldChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {goldChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value.toFixed(2)}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;