import { createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "./dashboardApi";

const initialState = {
    dashboardData: {},
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.dashboardData = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(dashboardApi.endpoints.getDashboardData.matchPending, setLoading)
        .addMatcher(dashboardApi.endpoints.getDashboardData.matchRejected, setError)
        .addMatcher(dashboardApi.endpoints.getDashboardData.matchFulfilled, (state, action) => {
            console.log("Dashboard data fetched:", action.payload);
            state.dashboardData = action.payload.data || {};
            state.loading = false;
            state.error = null;
        });
    },
});

export const { setDashboardData, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;