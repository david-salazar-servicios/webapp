import { apiSlice } from "../../app/api/apiSlice";

export const sendEmailContactoApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendEmailContacto: builder.mutation({
            query: (email) => ({
                url: "/sendEmail/emailContacto",
                method: "POST",
                body: email,
            }),               
        }),        
    }),    
});

export const {
    useSendEmailContactoMutation
} = sendEmailContactoApiSlice;
