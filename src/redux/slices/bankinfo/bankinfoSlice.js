import { createSlice } from "@reduxjs/toolkit";
import { bankinfoApi } from "./bankinfoApi";

const initialState = {
    bankinfo: {},
    loading: false,
    error: null,
};

const bankinfoSlice = createSlice({
    name: "bankinfo",
    initialState,
    reducers: {
        setBankInfo: (state, action) => {
            state.bankinfo = action.payload;
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
        .addMatcher(bankinfoApi.endpoints.getBankInfo.matchPending, setLoading)
        .addMatcher(bankinfoApi.endpoints.getBankInfo.matchRejected, setError)
        .addMatcher(bankinfoApi.endpoints.getBankInfo.matchFulfilled, (state, action) => {
            console.log("Bank info fetched:", action.payload);
            state.bankinfo = action.payload.data || {};
            state.loading = false;
            state.error = null;
        });
    },
});

export const { setBankInfo, setLoading, setError } = bankinfoSlice.actions;
export default bankinfoSlice.reducer;