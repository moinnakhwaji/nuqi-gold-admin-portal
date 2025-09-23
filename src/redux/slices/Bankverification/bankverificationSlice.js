import { createSlice } from "@reduxjs/toolkit";
import { bankverificationApi } from "./bankverificationapi";

const initialState = {
  bankverification: {},
  loading: false,
  error: null,
};

const bankverificationSlice = createSlice({
  name: "bankverification",
  initialState,
  reducers: {
    setBankVerification: (state, action) => {
      state.bankverification = action.payload;
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
      .addMatcher(bankverificationApi.endpoints.getBankKyc.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(bankverificationApi.endpoints.getBankKyc.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addMatcher(bankverificationApi.endpoints.getBankKyc.matchFulfilled, (state, action) => {
        console.log("Bank verification fetched:", action.payload);
        state.bankverification = action.payload.data || {};
        state.loading = false;
        state.error = null;
      })
      .addMatcher(bankverificationApi.endpoints.sendBankKycReminder.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(bankverificationApi.endpoints.sendBankKycReminder.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addMatcher(bankverificationApi.endpoints.sendBankKycReminder.matchFulfilled, (state, action) => {
        console.log("Bank verification reminder sent:", action.payload);
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setBankVerification, setLoading, setError } = bankverificationSlice.actions;
export default bankverificationSlice.reducer;
