import { apiSlice } from "../../app/api/apiSlice";

export const sendGenericEmailApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendGenericEmail: builder.mutation({
            query: (emailData) => ({
                url: "/sendEmail/genericEmail",
                method: "POST",
                body: emailData,
            }),
        }),
    }),
});

export const {
    useSendGenericEmailMutation,
} = sendGenericEmailApiSlice;
