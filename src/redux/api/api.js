import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query setup for RTK Query
const baseQuery = fetchBaseQuery({
  // baseUrl: 'https://uatapi.nuqiwealth.com/',
    baseUrl: 'http://localhost:5000/',
      credentials: "include", 
  prepareHeaders: (headers) => {

const token = localStorage.getItem("authToken");

    if (token && token !== 'undefined') {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Base API slice that can be extended
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Auth',
    'User',
    'KycRecords',
    'AllUsers',
    'CashDetails',
    'PhysicalDelivery',
    'Wallet',
    'Kidz',
    'Orderbook',
    'Dashboard',
    'BankInfo',
    'RiskProfile',
    'CepBaskets',
    'Stocks',
    'UserTransactions',
    'Transactions',
    'Network',
    'Blog'
  ],
  endpoints: () => ({
  }),
});
