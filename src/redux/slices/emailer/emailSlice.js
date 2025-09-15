import { createSlice } from "@reduxjs/toolkit";
import { emailApi } from "./emailApi";

const initialState = {
  emailResponse: null,
  loading: false,
  error: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    resetEmailState: (state) => {
      state.emailResponse = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(emailApi.endpoints.sendEmail.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(emailApi.endpoints.sendEmail.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to send email";
      })
      .addMatcher(emailApi.endpoints.sendEmail.matchFulfilled, (state, action) => {
        state.loading = false;
        state.emailResponse = action.payload;
        state.error = null;
      });
  },
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;
