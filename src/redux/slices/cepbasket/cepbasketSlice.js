import { createSlice } from "@reduxjs/toolkit";
import { cepbasketApi } from "./cepbasketApi";

const initialState = {
    cepBaskets: [],
    stocks: [],
    loading: false,
    error: null,
};

const cepbasketSlice = createSlice({
    name: "cepbasket",
    initialState,
    reducers: {
        setCepBaskets: (state, action) => {
            state.cepBaskets = action.payload;
        },
        setStocks: (state, action) => {
            state.stocks = action.payload;
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
        .addMatcher(cepbasketApi.endpoints.getCepBasket.matchPending, setLoading)
        .addMatcher(cepbasketApi.endpoints.getCepBasket.matchRejected, setError)
        .addMatcher(cepbasketApi.endpoints.getCepBasket.matchFulfilled, (state, action) => {
            console.log('cepbasketSlice', action.payload);
            state.cepBaskets = action.payload?.data ?? action.payload ?? [];
            state.loading = false;
            state.error = null;
        })
        .addMatcher(cepbasketApi.endpoints.getStocks.matchPending, setLoading)
        .addMatcher(cepbasketApi.endpoints.getStocks.matchRejected, setError)
        .addMatcher(cepbasketApi.endpoints.getStocks.matchFulfilled, (state, action) => {
            console.log('stocks', action.payload);
            state.stocks = action.payload?.data ?? action.payload ?? [];
            state.loading = false;
            state.error = null;
        })
        .addMatcher(cepbasketApi.endpoints.createCepBasket.matchPending, setLoading)
        .addMatcher(cepbasketApi.endpoints.createCepBasket.matchRejected, setError)
        .addMatcher(cepbasketApi.endpoints.createCepBasket.matchFulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addMatcher(cepbasketApi.endpoints.addStockToBasket.matchPending, setLoading)
        .addMatcher(cepbasketApi.endpoints.addStockToBasket.matchRejected, setError)
        .addMatcher(cepbasketApi.endpoints.addStockToBasket.matchFulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addMatcher(cepbasketApi.endpoints.removeStockFromBasket.matchPending, setLoading)
        .addMatcher(cepbasketApi.endpoints.removeStockFromBasket.matchRejected, setError)
        .addMatcher(cepbasketApi.endpoints.removeStockFromBasket.matchFulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addMatcher(cepbasketApi.endpoints.updateCepBasket.matchPending, setLoading)
        .addMatcher(cepbasketApi.endpoints.updateCepBasket.matchRejected, setError)
        .addMatcher(cepbasketApi.endpoints.updateCepBasket.matchFulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addMatcher(cepbasketApi.endpoints.bulkUpdateCepBaskets.matchPending, setLoading)
        .addMatcher(cepbasketApi.endpoints.bulkUpdateCepBaskets.matchRejected, setError)
        .addMatcher(cepbasketApi.endpoints.bulkUpdateCepBaskets.matchFulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });
    },
});

export const { setCepBaskets, setStocks, setLoading, setError } = cepbasketSlice.actions;
export default cepbasketSlice.reducer;


