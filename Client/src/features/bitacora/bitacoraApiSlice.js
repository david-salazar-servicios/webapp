import { apiSlice } from "../../app/api/apiSlice";

export const bitacoraApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBitacora: builder.query({
            query: () => '/bitacora',  // This should map to your controller route for fetching all bitacora entries
            transformResponse: (responseData) => {
                return responseData; // Transform if necessary
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'BitacoraMovimiento', id: 'LIST' },
                        ...result.map(({ id }) => ({ type: 'BitacoraMovimiento', id })), // Assuming `id` is the primary key in bitacoramovimiento
                    ];
                } else return [{ type: 'BitacoraMovimiento', id: 'LIST' }];
            },
        }),
    }),
});

export const {
    useGetBitacoraQuery,
} = bitacoraApiSlice;
