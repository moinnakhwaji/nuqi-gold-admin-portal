import { createSlice } from '@reduxjs/toolkit';
import { kycApi } from './kycApi';

const initialState = {
  kycRecords: [],
  loading: false,
  error: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycRecords: (state, action) => {
      state.kycRecords = action.payload;
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
    .addMatcher(kycApi.endpoints.getKycRecords.matchPending, setLoading)
    .addMatcher(kycApi.endpoints.getKycRecords.matchRejected, setError)
    .addMatcher(kycApi.endpoints.getKycRecords.matchFulfilled, (state, action) => {
      console.log("Kyc records fetched:", action.payload);
      // Extract the data array from the response
      state.kycRecords = action.payload.data || [];
      state.loading = false;
      state.error = null;
    });
  },
});

export const { setKycRecords, setLoading, setError } = kycSlice.actions;
export default kycSlice.reducer;