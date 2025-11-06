import { apiSlice } from "../../api/api";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 📊 Dashboard main data
    getDashboardData: builder.query({
      query: () => ({
        url: '/operations/dashboard',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    // 🔢 Total count data
    getTotalCount: builder.query({
      query: () => ({
        url: '/operations/dashboard/totalcount',
        method: 'GET',
      }),
      providesTags: ['TotalCount'],
    }),

    // 📈 User growth data (with optional query params)
    getUserGrowth: builder.query({
      query: ({ range = 'monthly', startDate, endDate } = {}) => {
        let url = `/operations/dashboard/getUserGrowth?range=${range}`;
        if (range === 'custom' && startDate && endDate) {
          url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['UserGrowth'],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetTotalCountQuery,
  useGetUserGrowthQuery,
} = dashboardApi;
