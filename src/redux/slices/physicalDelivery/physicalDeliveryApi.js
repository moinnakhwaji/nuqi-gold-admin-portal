import { apiSlice } from "../../api/api";

export const physicalDeliveryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPhysicalDeliveries: builder.query({
      query: (params = {}) => ({
        url: "operations/physical-delivery",
        method: "GET",
        params: {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        },
      }),
      
      // --- CORRECTED TRANSFORMRESPONSE BLOCK ---
      transformResponse: (response) => {
        // Now we correctly access the nested pagination object
        return {
          data: response.data || [],
          totalRecords: response.pagination.totalRecords || 0, // CORRECT PATH
          totalPages: response.pagination.totalPages || 1,     // CORRECT PATH
        };
      },
      // -----------------------------------------

      providesTags: ["PhysicalDelivery"],
    }),

    // ... (rest of your endpoints are fine)
    updatePhysicalDeliveryStatus: builder.mutation({ /* ... */ }),
    exportPhysicalDeliveries: builder.query({ /* ... */ }),
  }),
});

export const {
  useGetPhysicalDeliveriesQuery,
  useUpdatePhysicalDeliveryStatusMutation,
  useLazyExportPhysicalDeliveriesQuery,
} = physicalDeliveryApi;