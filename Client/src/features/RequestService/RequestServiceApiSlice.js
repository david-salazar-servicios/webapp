import { apiSlice } from "../../app/api/apiSlice";

export const requestServiceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSolicitudes: builder.query({
            query: () => '/solicitudes',
            transformResponse: (responseData) => {
                return responseData;
            },
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



        // Elimina addSolicitudDetails si no es necesario debido a la lógica combinada del endpoint

    }),
});

export const {
    useCreateSolicitudWithDetailsMutation, 
    useGetSolicitudesQuery
} = requestServiceApiSlice;
