// En tu apiSlice.js

import { apiSlice } from "../../app/api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendResetPasswordEmail: builder.mutation({
            query: ({ email }) => ({
                url: "/send-reset-password-email",
                method: "POST",
                body: { email },
            }),
            invalidatesTags: [{ type: 'Usuario', id: 'LIST' }],
        }),
        changePassword: builder.mutation({
            query: ({ id,newPassword,tempPassword }) => ({
                url: "/change-password", // Asegúrate de que esta URL coincida con la ruta en tu backend
                method: "PUT",
                body: { id,newPassword, tempPassword },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Usuario', id: 'LIST' }, { type: 'Usuario', id: id }],
        }),
    }),
});

export const {
    useSendResetPasswordEmailMutation,
    useChangePasswordMutation,
} = extendedApiSlice;
