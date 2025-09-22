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
      

      transformResponse: (response) => {
  
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
 updatePhysicalDeliveryStatus: builder.mutation({
      query: ({ order_id, status_to, message, actor }) => ({
        url: "operations/physical-delivery",
        method: "PUT",
        body: { order_id, status_to, message, actor },
      }),
      invalidatesTags: ["PhysicalDelivery"],
    }),
    exportPhysicalDeliveries: builder.query({
      query: (params) => ({
        url: "operations/physical-delivery",
        method: 'GET',
        params: { ...params, export: 'csv' }, // Add export=csv parameter
        responseHandler: (response) => response.blob(), // Handle the response as a blob
      }),
    }),
  }),
});

export const {
  useGetPhysicalDeliveriesQuery,
  useUpdatePhysicalDeliveryStatusMutation,
  useLazyExportPhysicalDeliveriesQuery,
} = physicalDeliveryApi;