// src/redux/slices/bank-kyc/bankkycApi.js  (Example Path)

import { apiSlice } from "../../api/api";

// 1. Define the API endpoints
export const bankverificationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBankKyc: builder.query({
      query: (params = {}) => {
        const queryParams = {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        };
        
        // Only add type parameter if it's not null/undefined
        if (params.type) {
          queryParams.type = params.type;
        }
        
        return {
          url: "operations/bankkyc/bankkyc",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["BankKyc"],
    }),

  updateBankDetails: builder.mutation({
  // Ensure this part accepts an object with `user_id` and `body`
  query: ({ user_id, body }) => ({
    url: `operations/bankkyc/bankkyc/${user_id}/details`,
    method: 'PUT',
    body,
  }),
  invalidatesTags: ['BankKyc'], 
}),

    updateKycRecordStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `operations/bankkyc/bankkyc/${id}/review`,
        method: "PUT",
        body: { status, reason },
      }),
      invalidatesTags: ["BankKyc"],
    }),

    getOnHoldBankKyc: builder.mutation({
      query: (bankId) => ({
        url: "operations/bankkyc/bankkyc/onhold",
        method: "POST",
        body: { bankId },
      }),
      invalidatesTags: ["BankKyc"],
    }),

    exportBankKycRecords: builder.query({
      query: (params = {}) => ({
        url: "operations/bankkyc/bankkyc",
        method: "GET",
        params: {
          ...params,
          export: 'csv',
        },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// 2. Export the auto-generated hooks for use in components
// This is the critical part that makes the hooks available for import.
export const {
  useGetBankKycQuery,
  useUpdateBankDetailsMutation,
  useUpdateKycRecordStatusMutation,
  useGetOnHoldBankKycMutation,
  useLazyExportBankKycRecordsQuery,
} = bankverificationApi;