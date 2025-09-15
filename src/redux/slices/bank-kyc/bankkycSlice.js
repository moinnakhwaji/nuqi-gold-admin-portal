import { createSlice } from "@reduxjs/toolkit";
import { bankKycApi } from "./bankkycApi";

const initialState = {
    bankKyc: [],
    loading: false,
    error: null,
};

const bankKycSlice = createSlice({
    name: "bankKyc",
    initialState,
    reducers: {
        setBankKyc: (state, action) => {
            state.bankKyc = action.payload;
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
        .addMatcher(bankKycApi.endpoints.getBankKyc.matchPending, setLoading)
        .addMatcher(bankKycApi.endpoints.getBankKyc.matchRejected, setError)
        .addMatcher(bankKycApi.endpoints.getBankKyc.matchFulfilled, (state, action) => {
            console.log("Bank kyc fetched:", action.payload);
            state.bankKyc = action.payload.data || [];
            state.loading = false;
            state.error = null;
        });
    },
});

export const { setBankKyc, setLoading, setError } = bankKycSlice.actions;
export default bankKycSlice.reducer;