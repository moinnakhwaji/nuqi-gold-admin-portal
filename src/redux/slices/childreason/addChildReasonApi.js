import { apiSlice } from "../../api/api";

export const addChildReasonApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        addChildReason: builder.mutation({
            query: ({ userId, templateHTML, subject, reason }) => ({
                url: `/operations/childreason/${userId}`, // Corrected URL to match your backend
                method: "POST",
                body: { templateHTML, subject, reason },
            }),
            // Use a specific tag for invalidation to refetch data after this mutation
            invalidatesTags: ["ChildReasons"],
        }),
    }),
});

export const { useAddChildReasonMutation } = addChildReasonApi;