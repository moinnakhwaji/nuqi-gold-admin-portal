import { apiSlice } from "../../api/api";

export const stocksApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getStocks: builder.query({
      query: () => ({
        url: "/operations/api/stocks",
        method: "GET",
      }),
      providesTags: ["Stocks"],
    }),
    saveStock: builder.mutation({
      // Create or update based on presence of id in body (backend handles both)
      query: (body) => ({
        url: "/operations/api/stocks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stocks"],
    }),
    deleteStock: builder.mutation({
      // Soft delete expects body: { id }
      query: (body) => ({
        url: "/operations/api/delete/stocks",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Stocks"],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useSaveStockMutation,
  useDeleteStockMutation,
} = stocksApi;
