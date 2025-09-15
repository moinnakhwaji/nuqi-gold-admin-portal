import { apiSlice } from '../../api/api';

// Inject auth endpoints into the base apiSlice
export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/operations/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(credentials, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Login response data:', data);

          if (data && data.token && data.user) {
            // Save token
            localStorage.setItem('authToken', data.token);
            // Save only the `user` object in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
