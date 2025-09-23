import { createSlice } from '@reduxjs/toolkit';
import { kycApi } from './kycApi';

const initialState = {
  kycRecords: [],
  loading: true, // Start with loading true to show loader on initial load
  error: null,
  currentPage: 1,
  totalRecords: 0,
  totalPages: 0,
  limit: 10,
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
    .addMatcher(kycApi.endpoints.getKycRecords.matchPending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addMatcher(kycApi.endpoints.getKycRecords.matchRejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
    .addMatcher(kycApi.endpoints.getKycRecords.matchFulfilled, (state, action) => {
      state.kycRecords = action.payload.data || [];
      state.currentPage = action.payload.currentPage || 1;
      state.totalRecords = action.payload.totalRecords || 0;
      state.totalPages = action.payload.totalPages || 0;
      state.limit = action.payload.limit || 10;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { setKycRecords, setLoading, setError } = kycSlice.actions;
export default kycSlice.reducer;