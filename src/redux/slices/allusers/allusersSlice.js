import { createSlice } from "@reduxjs/toolkit";
import { allusersApi } from "./allusersApi";

const initialState = {
  allusers: [],
  cashDetails: {},
  companyConfig: {},
  analysisPortfolios: {},
  userTransactions: [],
  loading: false,
  error: null,
};

const allusersSlice = createSlice({
  name: "allusers",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      state.allusers = action.payload;
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
      .addMatcher(allusersApi.endpoints.getallusers.matchPending, setLoading)
      .addMatcher(allusersApi.endpoints.getallusers.matchRejected, setError)
      .addMatcher(allusersApi.endpoints.getallusers.matchFulfilled,(state, action) => {
        console.log("All users fetched:", action.payload);
        state.allusers = action.payload.data || [];
        state.loading = false;
        state.error = null;
        })
      .addMatcher(allusersApi.endpoints.getCashDetails.matchPending, setLoading)
      .addMatcher(allusersApi.endpoints.getCashDetails.matchRejected, setError)
      .addMatcher(allusersApi.endpoints.getCashDetails.matchFulfilled,(state, action) => {
          console.log("Cash details fetched:", action.payload);
          state.cashDetails = action.payload.data || {};
        })
      .addMatcher(allusersApi.endpoints.getCompanyConfig.matchPending, setLoading)
      .addMatcher(allusersApi.endpoints.getCompanyConfig.matchRejected, setError)
      .addMatcher(allusersApi.endpoints.getCompanyConfig.matchFulfilled, (state, action) => {
          console.log("Company config fetched:", action.payload);
          state.companyConfig = action.payload.data || {};
        })
      .addMatcher(allusersApi.endpoints.getAnalysisPortfolios.matchPending, setLoading)
      .addMatcher(allusersApi.endpoints.getAnalysisPortfolios.matchRejected, setError)
      .addMatcher(allusersApi.endpoints.getAnalysisPortfolios.matchFulfilled, (state, action) => {
          console.log("Analysis portfolios fetched:", action.payload);
          state.analysisPortfolios = action.payload.data || {};
        })
      .addMatcher(allusersApi.endpoints.getUserTransactions.matchPending, setLoading)
      .addMatcher(allusersApi.endpoints.getUserTransactions.matchRejected, setError)
      .addMatcher(allusersApi.endpoints.getUserTransactions.matchFulfilled, (state, action) => {
          console.log("User transactions fetched:", action.payload);
          state.userTransactions = action.payload.data || [];
        });
  },
});

export const { setAllUsers, setLoading, setError } = allusersSlice.actions;
export default allusersSlice.reducer;
