import { apiSlice } from "../../api/api";

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
        
        if (params.type) {
          queryParams.type = params.type;
        }
        
        return {
          url: "operations/bankkyc/bankkyc", // This matches your backend route
          method: "GET",
          params: queryParams,
        };
      },

      providesTags: [{ type: 'BankKyc', id: 'LIST' }],
    }),


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

  
    updateOnHoldKycStatus: builder.mutation({
      query: ({ id, reason }) => ({
        url: `operations/bankkyc/onhold/status/${id}`,
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
        method: "GET",
        body: { bankId },
      }),
     
      invalidatesTags: [{ type: 'BankKyc', id: 'LIST' }],
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


export const {
  useGetBankKycQuery,
  useUpdateBankDetailsMutation,
  useUpdateOnHoldKycStatusMutation,
  useUpdateKycRecordStatusMutation,
  useGetOnHoldBankKycMutation,
  useLazyExportBankKycRecordsQuery,
} = bankverificationApi;