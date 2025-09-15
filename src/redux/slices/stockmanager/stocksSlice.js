import { createSlice } from "@reduxjs/toolkit";
import { stocksApi } from "./stocksApi";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStocks: (state, action) => {
      state.list = action.payload;
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
      .addMatcher(stocksApi.endpoints.getStocks.matchPending, setLoading)
      .addMatcher(stocksApi.endpoints.getStocks.matchRejected, setError)
      .addMatcher(stocksApi.endpoints.getStocks.matchFulfilled,(state, action) => {
        console.log("Stocks fetched:", action.payload);
          state.list = action.payload.data || [];
          state.loading = false;
          state.error = null;
        })
      .addMatcher(stocksApi.endpoints.saveStock.matchPending, setLoading)
      .addMatcher(stocksApi.endpoints.saveStock.matchRejected, setError)
      .addMatcher(stocksApi.endpoints.saveStock.matchFulfilled,(state, action) => {
          console.log("Stock saved:", action.payload);
          state.loading = false;
          state.error = null;
        })
      .addMatcher(stocksApi.endpoints.deleteStock.matchPending, setLoading)
      .addMatcher(stocksApi.endpoints.deleteStock.matchRejected, setError)
      .addMatcher(stocksApi.endpoints.deleteStock.matchFulfilled,(state, action) => {
        console.log("Stock deleted:", action.payload);
          state.loading = false;
          state.error = null;
        });
  },
});

export const { setStocks, setLoading, setError } = stocksSlice.actions;
export default stocksSlice.reducer;
