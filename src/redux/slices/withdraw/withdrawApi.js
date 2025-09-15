import { apiSlice } from "../../api/api";

export const withdrawApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getWithdrawals: builder.query({
      query: (params = {}) => ({
        url: "operations/withdraw",
        method: "GET",
        params: {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        },
      }),
      providesTags: ["Withdraw"],
    }),
  exportWithdrawals: builder.query({
  query: (params = {}) => ({
    url: "operations/withdraw",  
    method: "GET",
    params: {
      export: "csv",            
      search: params.search || "",
      ...params,
    },
    responseHandler: (response) => response.blob(),
  }),
}),

    approveWithdrawal: builder.mutation({
      query: (body) => ({
        url: "operations/withdraw/status",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Withdraw"],
    }),
    rejectWithdrawal: builder.mutation({
      query: (body) => ({
        url: "operations/rejectwithdrawal",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Withdraw"],
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useLazyExportWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
} = withdrawApi;
