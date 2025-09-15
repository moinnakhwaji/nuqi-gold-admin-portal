import { apiSlice } from "../../api/api";

export const bankinfoApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getBankInfo: builder.query({
            query: () => ({
                url: "/operations/bankInfo/all",
                method: "GET",
            }),
            providesTags: ["BankInfo"],
        }),
    }),
});

export const { useGetBankInfoQuery } = bankinfoApi;