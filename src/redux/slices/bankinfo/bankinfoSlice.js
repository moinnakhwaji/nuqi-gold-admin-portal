import { createSlice } from "@reduxjs/toolkit";
import { bankinfoApi } from "./bankinfoApi";

const initialState = {
    bankinfo: {},
    loading: true,
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
        .addMatcher(bankinfoApi.endpoints.getBankInfo.matchPending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addMatcher(bankinfoApi.endpoints.getBankInfo.matchRejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
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