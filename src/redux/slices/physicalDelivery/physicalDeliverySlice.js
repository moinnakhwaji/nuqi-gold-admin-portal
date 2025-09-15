import { createSlice } from "@reduxjs/toolkit";
import { physicalDeliveryApi } from "./physicalDeliveryApi";

const initialState = {
  deliveries: [],
  loading: false,
  error: null,
};

const physicalDeliverySlice = createSlice({
  name: "physicalDelivery",
  initialState,
  reducers: {
    setDeliveries: (state, action) => {
      state.deliveries = action.payload;
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
      // Fetch deliveries
      .addMatcher(
        physicalDeliveryApi.endpoints.getPhysicalDeliveries.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        physicalDeliveryApi.endpoints.getPhysicalDeliveries.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to fetch deliveries";
        }
      )
      .addMatcher(
        physicalDeliveryApi.endpoints.getPhysicalDeliveries.matchFulfilled,
        (state, action) => {
          console.log("Deliveries fetched:", action.payload);
          state.deliveries = action.payload.data || [];
          state.loading = false;
          state.error = null;
        }
      )

      // Update status
      .addMatcher(
        physicalDeliveryApi.endpoints.updatePhysicalDeliveryStatus.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        physicalDeliveryApi.endpoints.updatePhysicalDeliveryStatus.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to update delivery";
        }
      )
      .addMatcher(
        physicalDeliveryApi.endpoints.updatePhysicalDeliveryStatus.matchFulfilled,
        (state, action) => {
          console.log("Delivery updated:", action.payload);
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export const { setDeliveries, setLoading, setError } = physicalDeliverySlice.actions;
export default physicalDeliverySlice.reducer;
