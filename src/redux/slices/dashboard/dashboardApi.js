import { apiSlice } from "../../api/api";

export const dashboardApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getDashboardData: builder.query({
            query: () => ({
                url: '/operations/dashboard',
                method: 'GET',
            }),
            providesTags: ['Dashboard'],
        }),
    }),
});

export const { useGetDashboardDataQuery } = dashboardApi;