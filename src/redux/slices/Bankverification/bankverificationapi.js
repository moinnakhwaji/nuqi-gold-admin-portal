import { apiSlice } from "../../api/api";

export const bankverificationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    
    // QUERY to fetch the list of KYC records
    getBankKyc: builder.query({
      query: (params = {}) => {
        const queryParams = {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        };
        
        if (params.type) {
          queryParams.type = params.type;
        }
        
        return {
          url: "operations/bankkyc/bankkyc", // This matches your backend route
          method: "GET",
          params: queryParams,
        };
      },
      /**
       * ✅ FIX: Provides a specific tag for this list of data.
       * When a mutation invalidates this tag, this query will be automatically refetched.
       */
      providesTags: [{ type: 'BankKyc', id: 'LIST' }],
    }),

    // MUTATION to update bank details
    updateBankDetails: builder.mutation({
      query: ({ user_id, body }) => ({
        url: `operations/bankkyc/bankkyc/${user_id}/details`,
        method: 'PUT',
        body,
      }),
      /**
       * ✅ FIX: Invalidates the list tag.
       * This tells RTK Query that the 'BankKyc' list data is now stale and needs to be refetched.
       */
      invalidatesTags: [{ type: 'BankKyc', id: 'LIST' }],
    }),

    // MUTATION to update the ON_HOLD status
    updateOnHoldKycStatus: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `operations/bankkyc/onhold/status/${userId}`,
        method: 'PUT',
        body: { reason }, 
      }),
      invalidatesTags: [{ type: 'BankKyc', id: 'LIST' }],
    }),

    // MUTATION to update any KYC record status (Approve/Reject)
    updateKycRecordStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `operations/bankkyc/bankkyc/${id}/review`,
        method: "PUT",
        body: { status, reason },
      }),
      invalidatesTags: [{ type: 'BankKyc', id: 'LIST' }],
    }),

    // MUTATION to send a reminder (as per your original code)
    getOnHoldBankKyc: builder.mutation({
      query: (bankId) => ({
        url: "operations/bankkyc/bankkyc/onhold",
        method: "POST",
        body: { bankId },
      }),
      // This action likely does not change the list data, so it doesn't need to invalidate the tag.
    }),

    // QUERY for exporting data (does not need tags)
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


export const {
  useGetBankKycQuery,
  useUpdateBankDetailsMutation,
  useUpdateOnHoldKycStatusMutation,
  useUpdateKycRecordStatusMutation,
  useGetOnHoldBankKycMutation,
  useLazyExportBankKycRecordsQuery,
} = bankverificationApi;