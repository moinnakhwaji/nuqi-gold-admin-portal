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
      query: ({ BankId, templateId }) => ({
        url: `operations/bankkyc/bankkyc/onhold/status`,
        method: 'PUT',
        body: { BankId, templateId }, 
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

    // src/redux/api/yourApiSlice.js

getOnHoldBankKyc: builder.query({
  query: (params) => ({
    url: "operations/bankkyc/bankkyc/onhold",
    method: "GET",
    params: params,
  }),
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

    // MUTATION to send Bank KYC reminder
    sendBankKycReminder: builder.mutation({
      query: ({ userId, BankId, templateId }) => ({
        url: `operations/bankkyc/bankkyc/reminder/${userId}`,
        method: "POST",
        body: { BankId, templateId },
      }),
      invalidatesTags: [{ type: 'BankKyc', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBankKycQuery,
  useUpdateBankDetailsMutation,
  useUpdateOnHoldKycStatusMutation,
  useUpdateKycRecordStatusMutation,
  useGetOnHoldBankKycQuery,
  useLazyGetOnHoldBankKycQuery,
  useLazyExportBankKycRecordsQuery,
  useSendBankKycReminderMutation,
} = bankverificationApi;