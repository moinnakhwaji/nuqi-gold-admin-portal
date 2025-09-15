import { apiSlice } from "../../api/api";

export const bankKycApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getBankKyc: builder.query({
            query: () => ({
                url: "user/bankKyc/getallbankdetails",
                method: "GET",
            }),
            providesTags: ["BankKyc"],
        }),
    }),
});

export const { useGetBankKycQuery } = bankKycApi;