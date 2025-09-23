import React, { useState } from 'react';
import { FiUsers, FiCheckCircle, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useGetDashboardDataQuery } from '../redux/slices/dashboard/dashboardApi';
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

const Ecommerce = () => {
  const [isDark, setIsDark] = useState(false);
  const { data, isLoading, error } = useGetDashboardDataQuery();


 
  // console.log(data, "data ");

  // Loading state
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

  // Transform API data to match component structure
  const dashboardStats = [
    {
      title: "Total Users",
      amount: apiData.totalUsers?.toString() || "0",
      icon: <FiUsers />,
      color: "bg-purple-500"
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

  // Sample data for charts that don't have direct API equivalents
  const totalUsersChart = [
    { month: 'Jan', thisYear: Math.floor(apiData.totalUsers * 0.7), thisMonth: Math.floor(apiData.totalUsers * 0.8) },
    { month: 'Feb', thisYear: Math.floor(apiData.totalUsers * 0.75), thisMonth: Math.floor(apiData.totalUsers * 0.85) },
    { month: 'Mar', thisYear: Math.floor(apiData.totalUsers * 0.8), thisMonth: Math.floor(apiData.totalUsers * 0.9) },
    { month: 'Apr', thisYear: Math.floor(apiData.totalUsers * 0.85), thisMonth: Math.floor(apiData.totalUsers * 0.92) },
    { month: 'May', thisYear: Math.floor(apiData.totalUsers * 0.9), thisMonth: Math.floor(apiData.totalUsers * 0.95) },
    { month: 'Jun', thisYear: Math.floor(apiData.totalUsers * 0.95), thisMonth: Math.floor(apiData.totalUsers * 0.98) },
    { month: 'Jul', thisYear: apiData.totalUsers, thisMonth: apiData.totalUsers }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} stat={stat} isDark={isDark} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users Chart */}
        <div className={`col-span-2 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
                         rounded-xl p-6 border`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">User Growth Trend</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>This year</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>This month</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={totalUsersChart}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="thisYear" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="thisMonth" 
                  stroke="#9CA3AF" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#9CA3AF', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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