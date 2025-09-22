

import { apiSlice } from "../../api/api";

export const transactionApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    getTransactions: builder.query({
      query: (params = {}) => {
        const queryParams = {
          page: params.page || 1,
          limit: params.limit || 10,
        };

        if (params.search) queryParams.search = params.search;
        if (params.status && params.status !== 'all') queryParams.status = params.status;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;
        if (params.sortField) queryParams.sortField = params.sortField;
        if (params.sortDirection) queryParams.sortDirection = params.sortDirection;

        return {
          url: "operations/transactions/all",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Transactions"],
    }),
    
 
    exportTransactions: builder.query({
      query: (params = {}) => ({
        url: "operations/transactions/all",
        method: "GET",
        params: {
          ...params,
          export: "csv",
        },
         responseHandler: (response) => response.blob(),
      }),


   

    }),
  }),
});


export const { useGetTransactionsQuery, useLazyExportTransactionsQuery } = transactionApi;0