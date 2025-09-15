import { createSlice } from "@reduxjs/toolkit";
import { riskprofileApi } from "./riskprofileApi";

const initialState = {
  riskProfile: [],
  loading: false,
  error: null,
};

const riskprofileSlice = createSlice({
  name: "riskprofile",
  initialState,
  reducers: {
    setRiskProfile: (state, action) => {
      state.riskProfile = action.payload;
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
      .addMatcher(riskprofileApi.endpoints.getRiskProfile.matchPending,setLoading)
      .addMatcher(riskprofileApi.endpoints.getRiskProfile.matchRejected,setError)
      .addMatcher(riskprofileApi.endpoints.getRiskProfile.matchFulfilled,(state, action) => {
        console.log("Risk profile fetched:", action.payload);
          state.riskProfile = action.payload.data || [];
          state.loading = false;
          state.error = null;
        })
        .addMatcher(riskprofileApi.endpoints.activateUser.matchPending, setLoading)
        .addMatcher(riskprofileApi.endpoints.activateUser.matchRejected, setError)
        .addMatcher(riskprofileApi.endpoints.activateUser.matchFulfilled, (state, action) => {
          console.log("User activated:", action.payload);
          state.loading = false;
          state.error = null;
        })
        .addMatcher(riskprofileApi.endpoints.deactivateUser.matchPending, setLoading)
        .addMatcher(riskprofileApi.endpoints.deactivateUser.matchRejected, setError)
        .addMatcher(riskprofileApi.endpoints.deactivateUser.matchFulfilled, (state, action) => {
          console.log("User deactivated:", action.payload);
          state.loading = false;
          state.error = null;
        });
  },
});

export const { setRiskProfile, setLoading, setError } =
  riskprofileSlice.actions;
export default riskprofileSlice.reducer;
