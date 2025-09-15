import { apiSlice } from "../../api/api";

export const walletApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ✅ Get all EOD transactions
    getWallet: builder.query({
      query: () => ({
        url: "operations/wallet",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),

    // ✅ Add multiple EOD transactions
    uploadWalletEod: builder.mutation({
      query: (body) => ({
        url: "operations/wallet/multiple",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),

    // ✅ Update EOD transaction status (with id in URL)
    updateWalletEod: builder.mutation({
      query: ({ id, status }) => ({
        url: `operations/wallet/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useUploadWalletEodMutation,
  useUpdateWalletEodMutation,
} = walletApi;
