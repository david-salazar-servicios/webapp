import { apiSlice } from "../../app/api/apiSlice";

export const cuentaIbanApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all IBAN records
        getCuentasIban: builder.query({
            query: () => '/cuentaiban',
            transformResponse: (responseData) => responseData,
            providesTags: (result) => {
                if (result?.length) {
                    return [
                        { type: 'CuentaIban', id: 'LIST' },
                        ...result.map(({ id_cuenta }) => ({ type: 'CuentaIban', id: id_cuenta })),
                    ];
                } else return [{ type: 'CuentaIban', id: 'LIST' }];
            },
        }),

        // Fetch a single IBAN record by ID
        getCuentaIbanById: builder.query({
            query: (id) => `/cuentaiban/${id}`,
            transformResponse: (responseData) => responseData,
            providesTags: (result, error, id) => [{ type: 'CuentaIban', id }],
        }),

        // Create a new IBAN record
        createCuentaIban: builder.mutation({
            query: (newCuentaIban) => ({
                url: '/cuentaiban',
                method: 'POST',
                body: newCuentaIban,
            }),
            invalidatesTags: [{ type: 'CuentaIban', id: 'LIST' }],
        }),

        // Update an existing IBAN record
        updateCuentaIban: builder.mutation({
            query: ({ id_cuenta, ...updatedCuentaIban }) => ({
                url: `/cuentaiban/${id_cuenta}`,
                method: 'PUT',
                body: updatedCuentaIban,
            }),
            invalidatesTags: (result, error, { id_cuenta }) => [{ type: 'CuentaIban', id: id_cuenta }],
        }),

        // Delete an IBAN record
        deleteCuentaIban: builder.mutation({
            query: (id_cuenta) => ({
                url: `/cuentaiban/${id_cuenta}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'CuentaIban', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCuentasIbanQuery,
    useGetCuentaIbanByIdQuery,
    useCreateCuentaIbanMutation,
    useUpdateCuentaIbanMutation,
    useDeleteCuentaIbanMutation,
} = cuentaIbanApiSlice;
