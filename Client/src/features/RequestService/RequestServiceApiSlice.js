import { apiSlice } from "../../app/api/apiSlice";

export const requestServiceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSolicitudes: builder.query({
            query: () => '/solicitudes',
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Solicitudes', id: 'LIST' },
                        ...result.map(({ id_solicitud }) => ({ type: 'Solicitudes', id: id_solicitud })),
                    ];
                } else return [{ type: 'Solicitudes', id: 'LIST' }];
            },
        }),
        createSolicitudWithDetails: builder.mutation({
            query: (solicitudWithDetails) => ({
                url: '/solicitudes/confirmar',
                method: 'POST',
                body: solicitudWithDetails,
            }),
            invalidatesTags: [{ type: 'Solicitud', id: 'LIST' }, { type: 'DetalleSolicitud', id: 'LIST' }],
        }),
        getSolicitudById: builder.query({
            query: (solicitudId) => `/solicitudes/${solicitudId}`,
            providesTags: (result, error, solicitudId) => [{ type: 'Solicitud', id: solicitudId }],
        }),
        updateSolicitudEstado: builder.mutation({
            query: ({ id, estado }) => ({
                url: `/solicitudes/${id}/estado`,
                method: 'PUT',
                body: { estado },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Solicitud', id }],
        }),
    }),
});

export const {
    useCreateSolicitudWithDetailsMutation,
    useGetSolicitudesQuery,
    useGetSolicitudByIdQuery,
    useUpdateSolicitudEstadoMutation, // Export the new hook
} = requestServiceApiSlice;
