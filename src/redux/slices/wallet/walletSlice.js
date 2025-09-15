import { createSlice } from "@reduxjs/toolkit";
import { walletApi } from "./walletApi";

const initialState = {
  wallet: [],
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(walletApi.endpoints.getWallet.matchPending, setLoading)
      .addMatcher(walletApi.endpoints.getWallet.matchRejected, setError)
      .addMatcher(walletApi.endpoints.getWallet.matchFulfilled, (state, action) => {
        console.log("Wallet fetched:", action.payload);
        state.wallet = action.payload.data || [];
        state.loading = false;
        state.error = null;
      })
      .addMatcher(walletApi.endpoints.uploadWalletEod.matchPending, setLoading)
      .addMatcher(walletApi.endpoints.uploadWalletEod.matchRejected, setError)
      .addMatcher(walletApi.endpoints.uploadWalletEod.matchFulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addMatcher(walletApi.endpoints.updateWalletEod.matchPending, setLoading)
      .addMatcher(walletApi.endpoints.updateWalletEod.matchRejected, setError)
      .addMatcher(walletApi.endpoints.updateWalletEod.matchFulfilled, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setWallet, setLoading, setError } = walletSlice.actions;
export default walletSlice.reducer;