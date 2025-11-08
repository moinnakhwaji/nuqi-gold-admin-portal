import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/auth/authSlice'; // You correctly imported this

// This is your standard base query
const baseQuery = fetchBaseQuery({
  // baseUrl: 'https://uatapi.nuqiwealth.com/',
  baseUrl: 'http://localhost:9000/',
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

/**
 * This is the crucial new part.
 * It's a wrapper function that runs your baseQuery and checks the result.
 * If it sees a 401 error, it dispatches the `logout` action.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // First, we execute the original query
  let result = await baseQuery(args, api, extraOptions);

  // Then, we check if the result has a 401 error
  if (result.error && result.error.status === 401) {
    // If it does, we dispatch the logout action to clear the user's session
    console.log('Session expired, logging out...');
    api.dispatch(logout());
  }

  // Finally, we return the result (or error) to the calling function
  return result;
};


export const apiSlice = createApi({
  reducerPath: 'api',
  // IMPORTANT: Use the new `baseQueryWithReauth` wrapper here instead of the original `baseQuery`
  baseQuery: baseQueryWithReauth,
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
  endpoints: () => ({}),
});