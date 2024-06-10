import { apiSlice } from "../../app/api/apiSlice";

export const servicesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query({ // Cambia de mutation a query si solo estás obteniendo datos.
            query: () => '/servicios', // Simplificado para solo URL, asumiendo GET por defecto.
            transformResponse: (responseData) => {
                // Aquí asumo que responseData ya es un array de tus servicios.
                // No necesitas mapearlos uno por uno si solo los devuelves tal cual.
                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Servicio', id: 'LIST' },
                        ...result.map(({ id_servicio }) => ({ type: 'Servicio', id: id_servicio })),
                    ];
                } else return [{ type: 'Servicio', id: 'LIST' }];
            },
        }),
        // Tus otros endpoints aquí...
        createService: builder.mutation({
            query: (newService) => ({
                url: '/servicios',
                method: 'POST',
                body: newService,
            }),
            invalidatesTags: [{ type: 'Servicio', id: 'LIST' }],
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `/servicios/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Servicio', id: 'LIST' }],
        }),
        updateService: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/servicios/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: [{ type: 'Servicio', id: 'LIST' }],
        }),
        getServiceById: builder.query({
            query: (id) => `/servicios/${id}`,
            transformResponse: (responseData) => {
                // Transforma la respuesta si es necesario, o simplemente devuelve los datos directamente.
                return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'Servicio', id: 'LIST' }],
        }),

        deleteUserService: builder.mutation({
            query: ({ id_usuario, id_servicio }) => ({
                url: `/servicios/usuarios_servicios/${id_usuario}/${id_servicio}`,
                method: 'DELETE'

            }),
            invalidatesTags: [{ type: 'Servicio', id: 'LIST' }],
        }),

        deleteAllUserService: builder.mutation({
            query: ({ id_usuario }) => ({
                url: `/servicios/usuarios_servicios/${id_usuario}`,
                method: 'DELETE'

            }),
            invalidatesTags: [{ type: 'Servicio', id: 'LIST' }],
        }),   

        addUserService: builder.mutation({
            query: ({ id_usuario, id_servicio }) => ({
                url: '/servicios/usuarios_servicios', // Asegúrate de que esto esté correcto
                method: 'POST',
                body: { id_usuario, id_servicio },
            }),
            invalidatesTags: [{ type: 'Servicio', id: 'LIST' }],
        }),
        // Dentro de servicesApiSlice
        getUserServices: builder.query({
            query: (userId) => `/servicios/usuarios_servicios/${userId}`,
            transformResponse: (responseData) => {
                // Asumiendo que la respuesta es un array de los servicios del usuario.
                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Servicio', id: 'LIST' },
                        ...result.map(({ id_servicio }) => ({ type: 'Servicio', id: id_servicio })),
                    ];
                } else return [{ type: 'Servicio', id: 'LIST' }];
            },
        }),

        // Dentro de servicesApiSlice
        addSolicitudDetails: builder.mutation({
            query: (details) => ({
                url: '/detalles_solicitud',
                method: 'POST',
                body: details,
            }),
            invalidatesTags: [{ type: 'DetalleSolicitud', id: 'LIST' }],
        }),

        getAlbums: builder.mutation({
            query: (servicios) => ({
                url: '/servicios/album/all',
                method: 'POST',
                body: servicios,
            }),
            invalidatesTags: [{ type: 'Servicio', id: 'LIST' }],
        }),

        // Continúan los otros endpoints...
    }),
});

// Exporta los hooks generados automáticamente
export const {
    useGetServicesQuery,
    useCreateServiceMutation,
    useDeleteServiceMutation,
    useUpdateServiceMutation,
    useGetServiceByIdQuery,
    useAddUserServiceMutation,
    useGetUserServicesQuery,
    useDeleteUserServiceMutation,
    useAddSolicitudDetailsMutation,
    useDeleteAllUserServiceMutation,
    useGetAlbumsMutation
} = servicesApiSlice;
