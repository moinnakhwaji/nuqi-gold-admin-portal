import { createSlice } from "@reduxjs/toolkit";
import { addChildReasonApi } from "./addChildReasonApi";

const initialState = {
    response: null,
    loading: false,
    error: null,
};

const addChildReasonSlice = createSlice({
    name: "addChildReason",
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
        resetAddChildReason: (state) => {
            state.response = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(addChildReasonApi.endpoints.addChildReason.matchPending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addMatcher(addChildReasonApi.endpoints.addChildReason.matchFulfilled, (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = null;
        })
        .addMatcher(addChildReasonApi.endpoints.addChildReason.matchRejected, (state, action) => {
            state.loading = false;
            state.response = null;
            // More specific error handling based on your backend's error structure
            state.error = action.payload?.data?.message || action.error?.message || "Failed to add child template and reason";
        });
    },
});

export const { setResponse, setLoading, setError, resetAddChildReason } = addChildReasonSlice.actions;
export default addChildReasonSlice.reducer;