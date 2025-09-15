// src/redux/slices/bank-kyc/bankkycApi.js  (Example Path)

import { apiSlice } from "../../api/api";

// 1. Define the API endpoints
export const bankverificationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBankKyc: builder.query({
      query: () => ({
        url: "operations/bankkyc/bankkyc",
        method: "GET",
      }),
      providesTags: ["BankKyc"],
    }),

  updateBankDetails: builder.mutation({
  // Ensure this part accepts an object with `user_id` and `body`
  query: ({ user_id, body }) => ({
    url: `operations/bankkyc/bankkyc/${user_id}/details`,
    method: 'PUT',
    body, // The data to be sent in the request body
  }),
  invalidatesTags: ['BankKyc'], // Optional but recommended for auto-refresh
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
  }),
});

// 2. Export the auto-generated hooks for use in components
// This is the critical part that makes the hooks available for import.
export const {
  useGetBankKycQuery,
  useUpdateBankDetailsMutation,
  useUpdateKycRecordStatusMutation,
  useGetOnHoldBankKycMutation,
} = bankverificationApi;