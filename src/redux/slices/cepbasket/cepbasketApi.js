import { apiSlice } from "../../api/api";

export const cepbasketApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getCepBasket: builder.query({
            query: () => ({
                url: "/operations/api/cep-baskets",
                method: "GET",
            }),
            providesTags: ["CepBaskets"],
        }),
        getStocks: builder.query({
            query: () => ({
                url: "/operations/api/stocks",
                method: "GET",
            }),
            providesTags: ["Stocks"],
        }),
        createCepBasket: builder.mutation({
            query: (body) => ({
                url: "/operations/api/cep-baskets",
                method: "POST",
                body,
            }),
            invalidatesTags: ["CepBaskets"],
        }),
        addStockToBasket: builder.mutation({
            query: ({ basketId, stockId, volume, marketCap, basketWeight, marketcapWeight }) => ({
                url: `/operations/api/cep-baskets/${basketId}/add-stock`,
                method: "POST",
                body: {
                    stock_id: stockId,
                    volume,
                    market_cap: marketCap,
                    basket_weight: basketWeight,
                    marketcap_weight: marketcapWeight,
                },
            }),
            invalidatesTags: ["CepBaskets"],
        }),
        removeStockFromBasket: builder.mutation({
            query: ({ basketId, stockId }) => ({
                url: `/operations/api/cep-baskets/${basketId}/remove-stock`,
                method: "DELETE",
                body: { stock_id: stockId },
            }),
            invalidatesTags: ["CepBaskets"],
        }),
        updateCepBasket: builder.mutation({
            query: ({ basketId, body }) => ({
                url: `/operations/api/cep-baskets/${basketId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["CepBaskets"],
        }),
        bulkUpdateCepBaskets: builder.mutation({
            query: (updates) => ({
                url: "/operations/api/cep-baskets/bulk-update",
                method: "POST",
                body: updates,
            }),
            invalidatesTags: ["CepBaskets"],
        }),
    }),
});

export const {
    useGetCepBasketQuery,
    useGetStocksQuery,
    useCreateCepBasketMutation,
    useAddStockToBasketMutation,
    useRemoveStockFromBasketMutation,
    useUpdateCepBasketMutation,
    useBulkUpdateCepBasketsMutation,
} = cepbasketApi;
