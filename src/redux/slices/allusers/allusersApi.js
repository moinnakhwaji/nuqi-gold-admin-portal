import { apiSlice } from "../../api/api";

export const allusersApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getallusers: builder.query({
      query: (params = {}) => ({
        url: "/operations/allPortfolios",
        method: "GET",
        params: {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        },
      }),
      providesTags: ["AllUsers"],
    }),
    getCashDetails: builder.query({
      query: ({ userId }) => ({
        url: `/operations/cash_details/${userId}`,
        method: "GET",
      }),
      providesTags: ["CashDetails"],
    }),
    getCompanyConfig: builder.query({
      query: () => ({ url: "/cms/config", method: "GET" }),
      providesTags: ["User"],
    }),
    getAnalysisPortfolios: builder.query({
      query: ({ userId }) => ({
        url: `/operations/analysis_portfolios/${userId}`,
        method: "GET",
      }),
      providesTags: ["AnalysisPortfolios"],
    }),
    // User Transactions (Order Book)
    getUserTransactions: builder.query({
      query: ({
        userId,
        type = "ALL",
        method = undefined,
        fromDate = undefined,
        toDate = undefined,
        sector = "",
        exchange = "",
        order = "",
        orderstatus = "",
        search = "",
      }) => ({
        url: `/operations/userTransactions/${userId}`,
        method: "GET",
        params: {
          type,
          method,
          from_date: fromDate,
          to_date: toDate,
          sector,
          exchange,
          order,
          orderstatus,
          search,
        },
      }),
      providesTags: ["UserTransactions"],
    }),
  }),
});

export const {
  useGetallusersQuery,
  useGetCashDetailsQuery,
  useGetCompanyConfigQuery,
  useGetAnalysisPortfoliosQuery,
  useGetUserTransactionsQuery,
} = allusersApi;
