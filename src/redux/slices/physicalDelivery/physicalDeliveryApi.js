import { apiSlice } from "../../api/api";

export const physicalDeliveryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ✅ Get all physical deliveries
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
      providesTags: ["PhysicalDelivery"],
    }),

    // ✅ Update delivery status
    updatePhysicalDeliveryStatus: builder.mutation({
      query: ({ order_id, status_to, message, actor }) => ({
        url: "operations/physical-delivery",
        method: "PUT",
        body: { order_id, status_to, message, actor },
      }),
      invalidatesTags: ["PhysicalDelivery"],
    }),

    // ✅ Export physical deliveries to CSV
    exportPhysicalDeliveries: builder.query({
      query: (params = {}) => ({
        url: "operations/physical-delivery",
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
  useGetPhysicalDeliveriesQuery,
  useUpdatePhysicalDeliveryStatusMutation,
  useLazyExportPhysicalDeliveriesQuery,
} = physicalDeliveryApi;
