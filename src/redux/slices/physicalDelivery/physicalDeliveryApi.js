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
  }),
});

export const {
  useGetPhysicalDeliveriesQuery,
  useUpdatePhysicalDeliveryStatusMutation,
} = physicalDeliveryApi;
