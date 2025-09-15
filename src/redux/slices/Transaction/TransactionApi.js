import { apiSlice } from "../../api/api";

export const transactionApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (params = {}) => {
        // This part correctly builds the query parameters
        const queryParams = {
          page: params.page || 1,
          limit: params.limit || 10,
        };

        if (params.search) {
          queryParams.search = params.search;
        }
        // It's ready to accept a status
        if (params.status && params.status !== 'all') {
          queryParams.status = params.status;
        }
        // It's ready to accept dates
        if (params.startDate) {
          queryParams.startDate = new Date(params.startDate).toISOString().split('T')[0];
        }
        if (params.endDate) {
          queryParams.endDate = new Date(params.endDate).toISOString().split('T')[0];
        }

        return {
          url: "operations/transactions/all",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Transactions"],
    }),
    // ... exportTransactions endpoint
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

export const { useGetTransactionsQuery, useLazyExportTransactionsQuery } = transactionApi;