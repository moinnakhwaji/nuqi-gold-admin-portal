import { createSlice } from "@reduxjs/toolkit";
import { blogApi } from "./blogApi";

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(blogApi.endpoints.createBlog.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(blogApi.endpoints.createBlog.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addMatcher(blogApi.endpoints.createBlog.matchFulfilled, (state, action) => {
        state.blogs.push(action.payload?.data);
        state.loading = false;
        state.error = null;
      });
  },
});

export default blogSlice.reducer;
