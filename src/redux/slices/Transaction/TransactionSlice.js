import { createSlice } from "@reduxjs/toolkit";
import { transactionApi } from "./TransactionApi";

const initialState = {
    transactions: [],
    loading: false,
    error: null,
};

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactions: (state, action) => {
            state.transactions = action.payload;
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
        .addMatcher(transactionApi.endpoints.getTransactions.matchPending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addMatcher(transactionApi.endpoints.getTransactions.matchRejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
        .addMatcher(transactionApi.endpoints.getTransactions.matchFulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.transactions = action.payload.data || [];
        });
    },
});

export const { setTransactions, setLoading, setError } = transactionSlice.actions;
export default transactionSlice.reducer;
