import { apiSlice } from "../../api/api";

export const emailApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    sendEmail: builder.mutation({
      query: (emailData) => ({
        url: "/operations/emailer/send",
        method: "POST",
        body: emailData, 
      }),
      invalidatesTags: ["Email"],
    }),
  }),
});

export const { useSendEmailMutation } = emailApi;
