import { apiSlice } from "../../api/api";

export const kidzApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getKidzAccount: builder.query({
      query: (params = {}) => {
        const { page = 1, search, status } = params;
        const queryParams = { page };
        if (search) {
          queryParams.search = search;
        }
        if (status) {
          queryParams.status = status;
        }
        return {
          url: "/operations/kidz/all",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["KidzAccount"],
    }),

    exportKidzAccount: builder.query({
      query: (params = {}) => {
        const { search, status } = params;
        const queryParams = { export: "csv" };
        if (search) {
          queryParams.search = search;
        }
        if (status) {
          queryParams.status = status;
        }
        return {
          url: "/operations/kidz/all",
          method: "GET",
          params: queryParams,
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    approveKidzAccount: builder.mutation({
      query: (childId) => ({
        url: `/operations/kidz/approve/${childId}`,
        method: "POST",
        body: {
          status: "approved",
          child_id: childId,
        },
      }),
      invalidatesTags: ["KidzAccount"],
    }),

    rejectKidzAccount: builder.mutation({
      query: (childId) => ({
        url: `/operations/kidz/reject/${childId}`,
        method: "POST",
        body: {
          status: "rejected",
          child_id: childId,
        },
      }),
      invalidatesTags: ["KidzAccount"],
    }),

    getChildTemplates: builder.query({
      query: () => ({
        url: "/operations/kidz/templates",
        method: "GET",
      }),
      providesTags: ["ChildTemplates"],
    }),

    // ✅ Added: Onhold mutation
    onHoldChildUser: builder.mutation({
      query: ({ childId, status, templateId }) => ({
        url: `/operations/kidz/onhold/${childId}`,
        method: "PUT",
        body: {
          status,
          templateId,
          child_id: childId,
        },
      }),
      invalidatesTags: ["KidzAccount"],
    }),
  }),
});

export const {
  useGetKidzAccountQuery,
  useLazyExportKidzAccountQuery,
  useApproveKidzAccountMutation,
  useRejectKidzAccountMutation,
  useGetChildTemplatesQuery,
  useOnHoldChildUserMutation, 
} = kidzApi;
