import { apiSlice } from "../../api/api";

export const riskprofileApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getRiskProfile: builder.query({
      query: (params = {}) => ({
        url: "/operations/riskprofiles",
        method: "GET",
        params: {
          page: params.page || 1,
          search: params.search || "",
          ...params,
        },
      }),
      providesTags: ["RiskProfile"],
    }),
    activateUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: "/operations/activeuser",
        method: "POST",
        body: {
          userId,
          reason,
        },
      }),
      invalidatesTags: ["RiskProfile"],
    }),
    deactivateUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: "/operations/deactiveuser",
        method: "POST",
        body: {
          userId,
          reason,
        },
      }),
      invalidatesTags: ["RiskProfile"],
    }),
  }),
});

export const {
  useGetRiskProfileQuery,
  useActivateUserMutation,
  useDeactivateUserMutation,
} = riskprofileApi;
