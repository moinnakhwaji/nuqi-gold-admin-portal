import { apiSlice } from "../../api/api";

export const orderbookApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOrderbook: builder.query({
      query: (params = {}) => ({
        url: "/operations/transactions",
        method: "GET",
        params: {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        },
      }),
      providesTags: ["Orderbook"],
    }),
  }),
});

export const { useGetOrderbookQuery } = orderbookApi;