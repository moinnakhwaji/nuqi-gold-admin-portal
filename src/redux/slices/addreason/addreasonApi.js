import { apiSlice } from "../../api/api";

export const addReasonApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        addReason: builder.mutation({
            query: ({ userId, reason, template_html, subject }) => ({
                url: `/operations/addreason/${userId}`,
                method: "POST",
                body: { reason, template_html, subject },
            }),
            invalidatesTags: ["AddReason"],
        }),
    }),
});

export const { useAddReasonMutation } = addReasonApi;
