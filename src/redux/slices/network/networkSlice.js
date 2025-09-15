// src/redux/slices/network/networkSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { networkApi } from "./networkApi";

const initialState = {
  networkInfo: [],
  loading: false,
  error: null,
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNetworkInfo: (state, action) => {
      state.networkInfo = action.payload;
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
    .addMatcher(networkApi.endpoints.getNetworkInfo.matchPending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addMatcher(networkApi.endpoints.getNetworkInfo.matchRejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message || "Failed to fetch network info";
    })
    .addMatcher(networkApi.endpoints.getNetworkInfo.matchFulfilled, (state, action) => {
      console.log("✅ Network info fetched:", action.payload);
      state.networkInfo = action.payload; // now directly the array
      state.loading = false;
      state.error = null;
    });
}

});

export const { setNetworkInfo, setLoading, setError } = networkSlice.actions;
export default networkSlice.reducer;
