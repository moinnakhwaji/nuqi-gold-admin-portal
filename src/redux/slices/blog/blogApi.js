import { apiSlice } from "../../api/api";

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "/operations/blog/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
}); 

export const { useCreateBlogMutation } = blogApi;
