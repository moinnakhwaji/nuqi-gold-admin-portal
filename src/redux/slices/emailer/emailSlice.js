import { createSlice } from "@reduxjs/toolkit";
import { emailApi } from "./emailApi";

const initialState = {
  emailResponse: null,
  loading: false,
  error: null,
  success: false, // Add success state for better UX
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    resetEmailState: (state) => {
      state.emailResponse = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(emailApi.endpoints.sendEmail.matchPending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.emailResponse = null;
      })
      .addMatcher(emailApi.endpoints.sendEmail.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to send email";
        state.success = false;
        state.emailResponse = null;
      })
      .addMatcher(emailApi.endpoints.sendEmail.matchFulfilled, (state, action) => {
        // Only update if not already successful to prevent duplicate toasts
        if (!state.success) {
          state.loading = false;
          state.emailResponse = action.payload;
          state.error = null;
          state.success = true;
        }
      });
  },
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;
