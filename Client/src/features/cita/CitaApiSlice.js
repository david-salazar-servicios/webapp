import { apiSlice } from '../../app/api/apiSlice';

export const citaApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all citas
        getAllCitas: builder.query({
            query: () => '/citas',
            transformResponse: (responseData) => {
                // Transform the response if needed
                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Citas', id: 'LIST' },
                        ...result.map(({ id_cita }) => ({ type: 'Citas', id: id_cita })),
                    ];
                } else return [{ type: 'Citas', id: 'LIST' }];
            },
        }),

        // Get a cita by ID
        getCitaById: builder.query({
            query: (id) => `/citas/${id}`,
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'Citas', id }],
        }),

        // Create a new cita
        createCita: builder.mutation({
            query: (newCita) => ({
                url: '/citas',
                method: 'POST',
                body: newCita,
            }),
            invalidatesTags: [{ type: 'Citas', id: 'LIST' }],
        }),

        // Delete a cita by ID
        deleteCita: builder.mutation({
            query: (id) => ({
                url: `/citas/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Citas', id: 'LIST' }],
        }),

        // Update a cita by ID
        updateCita: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/citas/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Citas', id }],
        }),
    }),
});

export const {
    useGetAllCitasQuery,
    useGetCitaByIdQuery,
    useCreateCitaMutation,
    useDeleteCitaMutation,
    useUpdateCitaMutation,
} = citaApiSlice;
