import { createSlice } from "@reduxjs/toolkit";
import { addReasonApi } from "./addreasonApi";

const initialState = {
    response: null,
    loading: false,
    error: null,
};

const addReasonSlice = createSlice({
    name: "addReason",
    initialState,
    reducers: {
        setResponse: (state, action) => {
            state.response = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetAddReason: (state) => {
            state.response = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(addReasonApi.endpoints.addReason.matchPending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addMatcher(addReasonApi.endpoints.addReason.matchFulfilled, (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = null;
        })
        .addMatcher(addReasonApi.endpoints.addReason.matchRejected, (state, action) => {
            state.loading = false;
            state.response = null;
            state.error = action.error?.data || action.error?.message || "Failed to add reason";
        });
    },
});

export const { setResponse, setLoading, setError, resetAddReason } = addReasonSlice.actions;
export default addReasonSlice.reducer;
