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

        getSolicitudesByTecnico: builder.query({
            query: (tecnicoId) => `/solicitudes/tenico/${tecnicoId}`,
            providesTags: (result, error, tecnicoId) => [{ type: 'Solicitud', id: tecnicoId }],
        }),
        updateSolicitudEstado: builder.mutation({
            query: ({ id, estado }) => ({
                url: `/solicitudes/${id}/estado`,
                method: 'PUT',
                body: { estado },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Solicitud', id }],
        }),
        // New method for updating fecha_preferencia
        updateSolicitudFechaPreferencia: builder.mutation({
            query: ({ id, fecha_preferencia }) => ({
                url: `/solicitudes/${id}/fecha_preferencia`,
                method: 'PUT',
                body: { fecha_preferencia },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Solicitud', id }],
        }),

        getServiceSolicitudesReport: builder.query({
            query: () => '/solicitudes/report/service-solicitudes',
            providesTags: [{ type: 'Report', id: 'ServiceSolicitudes' }],
        }),

        getSolicitudesByTecnico: builder.query({
            query: (tecnicoId) => `/solicitudes/tecnico/${tecnicoId}`,
            providesTags: (result, error, tecnicoId) => [
                { type: 'SolicitudesByTecnico', id: tecnicoId },
                ...(result?.length
                    ? result.map(({ id_solicitud }) => ({ type: 'Solicitud', id: id_solicitud }))
                    : []),
            ],
        }),
    }),
    
});

export const {
    useCreateSolicitudWithDetailsMutation,
    useGetSolicitudesQuery,
    useGetSolicitudByIdQuery,
    useUpdateSolicitudEstadoMutation,
    useUpdateSolicitudFechaPreferenciaMutation,
    useLazyGetSolicitudesByTecnicoQuery,
    useGetServiceSolicitudesReportQuery,
    useGetSolicitudesByTecnicoQuery, // Export the new hook
} = requestServiceApiSlice;
