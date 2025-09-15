// src/redux/slices/network/networkApi.js

import { apiSlice } from "../../api/api"; // base apiSlice config

// src/redux/slices/network/networkApi.js
export const networkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkInfo: builder.query({
      query: () => "/operations/network",
      
      transformResponse: (response) => {
         console.log("🔥 Raw response from API:", response);
        return response.data || [];
      },
    }),
  }),
});

export const { useGetNetworkInfoQuery } = networkApi;


