import { createSlice } from "@reduxjs/toolkit";
import { orderbookApi } from "./orderbookApi";

const initialState = {
    orderbook: [],
    loading: false,
    error: null,
};

const orderbookSlice = createSlice({
    name: "orderbook",
    initialState,
    reducers: {
        setOrderbook: (state, action) => {
            state.orderbook = action.payload;
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
        .addMatcher(orderbookApi.endpoints.getOrderbook.matchPending, setLoading)
        .addMatcher(orderbookApi.endpoints.getOrderbook.matchRejected, setError)
        .addMatcher(orderbookApi.endpoints.getOrderbook.matchFulfilled, (state, action) => {
            console.log("Order Table Transactions fetched:", action.payload);
            state.orderbook = action.payload.data || [];
            state.loading = false;
            state.error = null;
        });
    },
});

export const { setOrderbook, setLoading, setError } = orderbookSlice.actions;
export default orderbookSlice.reducer;