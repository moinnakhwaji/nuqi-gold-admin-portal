import { apiSlice } from "../../api/api";

export const walletApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    
    getWallet: builder.query({
      // 1. ACCEPT 'status' AS AN ARGUMENT HERE
      query: ({ page = 1, limit = 10, search = '', status = 'pending' }) => ({
        url: "operations/wallet",
        method: "GET",
        // 2. PASS 'status' TO THE BACKEND IN THE PARAMS OBJECT
        params: { page, limit, search, status }, 
      }),

      transformResponse: (response) => {
        // This part is correct, but it needs the backend to send the right data.
        return {
          transactions: response.data || [], // Use default empty array
          meta: {                 
            totalRecords: response.totalRecords,
            totalPages: response.totalPages,
            currentPage: response.currentPage,
            limit: response.limit,
          },
        };
      },
      // This tagging strategy helps RTK automatically refetch when data changes
      providesTags: (result, error, arg) => [
        { type: "Wallet", id: "LIST" },
        // Also provide a tag for the specific status list
        { type: "Wallet", id: arg.status } 
      ],
    }),

    uploadWalletEod: builder.mutation({
      query: (body) => ({
        url: "operations/wallet/multiple",
        method: "POST",
        body,
      }),
      // This will invalidate the entire 'Wallet' list and force a refetch
      invalidatesTags: [{ type: "Wallet", id: "LIST" }], 
    }),

    updateWalletEod: builder.mutation({
      query: ({ id, status }) => ({
        url: `operations/wallet/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: [{ type: "Wallet", id: "LIST" }],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useUploadWalletEodMutation,
  useUpdateWalletEodMutation,
} = walletApi;