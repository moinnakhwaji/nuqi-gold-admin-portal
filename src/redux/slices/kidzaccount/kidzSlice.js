import { createSlice } from "@reduxjs/toolkit";
import { kidzApi } from   "./KidzApi"

const initialState = {
  kidzAccount: [],
  loading: false,
  error: null,
};

const kidzSlice = createSlice({
  name: "kidz",
  initialState,
  reducers: {
    setKidzAccount: (state, action) => {
      state.kidzAccount = action.payload;
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
      .addMatcher(kidzApi.endpoints.getKidzAccount.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        kidzApi.endpoints.getKidzAccount.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      )
      .addMatcher(
        kidzApi.endpoints.getKidzAccount.matchFulfilled,
        (state, action) => {
          console.log("Kidz account fetched:", action.payload);
          state.kidzAccount = action.payload.data || [];
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        kidzApi.endpoints.approveKidzAccount.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        kidzApi.endpoints.approveKidzAccount.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      )
      .addMatcher(
        kidzApi.endpoints.approveKidzAccount.matchFulfilled,
        (state, action) => {
          console.log("Kidz account approved:", action.payload);
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(kidzApi.endpoints.rejectKidzAccount.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        kidzApi.endpoints.rejectKidzAccount.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      )
      .addMatcher(
        kidzApi.endpoints.rejectKidzAccount.matchFulfilled,
        (state, action) => {
          console.log("Kidz account rejected:", action.payload);
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export const { setKidzAccount, setLoading, setError } = kidzSlice.actions;
export default kidzSlice.reducer;