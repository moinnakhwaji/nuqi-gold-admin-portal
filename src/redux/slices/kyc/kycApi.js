import { apiSlice } from "../../api/api";

export const kycApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getKycRecords: builder.query({
      query: (params = {}) => ({
        url: "operations/kyc/all",
        method: "GET",
        params: {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        },
      }),
      providesTags: ["KycRecords"],
      keepUnusedDataFor: 0, // Disable caching to prevent pagination issues
    }),
    exportKycRecords: builder.query({
      query: (params = {}) => ({
        url: "operations/kyc/all",
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

export const { useGetKycRecordsQuery,useLazyExportKycRecordsQuery } = kycApi;