import { createSlice } from "@reduxjs/toolkit";
import { withdrawApi } from "./withdrawApi";

const initialState = {
  withdraw: [],
  loading: false,
  error: null,
};

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState,
  reducers: {
    setWithdraw: (state, action) => {
      state.withdraw = action.payload;
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
      .addMatcher(withdrawApi.endpoints.getWithdrawals.matchPending, setLoading)
      .addMatcher(withdrawApi.endpoints.getWithdrawals.matchRejected, setError)
      .addMatcher(
        withdrawApi.endpoints.getWithdrawals.matchFulfilled,
        (state, action) => {
          console.log("Withdrawals fetched:", action.payload);
          state.withdraw = action.payload.data || [];
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        withdrawApi.endpoints.approveWithdrawal.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        withdrawApi.endpoints.approveWithdrawal.matchFulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        withdrawApi.endpoints.approveWithdrawal.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      )
      .addMatcher(
        withdrawApi.endpoints.rejectWithdrawal.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        withdrawApi.endpoints.rejectWithdrawal.matchFulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        withdrawApi.endpoints.rejectWithdrawal.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { setWithdraw, setLoading, setError } = withdrawSlice.actions;
export default withdrawSlice.reducer;
