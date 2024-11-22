import { apiSlice } from "../../app/api/apiSlice";

export const proformaApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all proformas
        getProformas: builder.query({
            query: () => '/proformas', // Maps to GET /proforma
            transformResponse: (responseData) => {
                return responseData; // Transform if needed
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Proforma', id: 'LIST' },
                        ...result.map(({ id_proforma }) => ({ type: 'Proforma', id: id_proforma })),
                    ];
                } else return [{ type: 'Proforma', id: 'LIST' }];
            },
        }),

        // Fetch a proforma by ID
        getProformaById: builder.query({
            query: (id) => `/proformas/${id}`, // Maps to GET /proforma/:id
            transformResponse: (responseData) => {
                return responseData; // Transform if needed
            },
            providesTags: (result, error, id) => [{ type: 'Proforma', id }],
        }),

        // Fetch a proforma by numeroArchivo
        getProformaByNumeroArchivo: builder.query({
            query: (numeroArchivo) => `/proformas/numero_archivo/${numeroArchivo}`, // Maps to GET /proforma/numero_archivo/:numeroArchivo
            transformResponse: (responseData) => {
                return responseData; // Transform if needed
            },
            providesTags: (result, error, numeroArchivo) => [{ type: 'Proforma', id: `NUMERO_ARCHIVO_${numeroArchivo}` }],
        }),

        // Create a new proforma
        createProforma: builder.mutation({
            query: (newProforma) => ({
                url: '/proformas',
                method: 'POST',
                body: newProforma,
            }),
            invalidatesTags: [{ type: 'Proforma', id: 'LIST' }],
        }),

        // Update an existing proforma
        updateProforma: builder.mutation({
            query: ({ id, updatedProforma }) => ({
                url: `/proformas/${id}`,
                method: 'PUT',
                body: updatedProforma,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Proforma', id }],
        }),

        // Delete a proforma
        deleteProforma: builder.mutation({
            query: (id) => ({
                url: `/proformas/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Proforma', id }],
        }),

        finalizarProforma: builder.mutation({
            query: (id) => ({
                url: `/proformas/${id}/finalizar`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Proforma", id }],
        }),
    }),
});

export const {
    useGetProformasQuery,
    useGetProformaByIdQuery,
    useGetProformaByNumeroArchivoQuery,
    useCreateProformaMutation,
    useUpdateProformaMutation,
    useDeleteProformaMutation,
    useFinalizarProformaMutation,
} = proformaApiSlice;
