import { apiSlice } from "../../app/api/apiSlice";

export const inventarioApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all inventarios
        getInventarios: builder.query({
            query: () => '/inventario',
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Inventario', id: 'LIST' },
                        ...result.map(({ id_inventario }) => ({ type: 'Inventario', id: id_inventario })),
                    ];
                } else return [{ type: 'Inventario', id: 'LIST' }];
            },
        }),

        // Fetch a single inventario by ID
        getInventarioById: builder.query({
            query: (id) => `/inventario/${id}`,
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'Inventario', id }],
        }),

        // Create a new inventario
        createInventario: builder.mutation({
            query: (newInventario) => ({
                url: '/inventario',
                method: 'POST',
                body: newInventario,
            }),
            invalidatesTags: [{ type: 'Inventario', id: 'LIST' }],
        }),

        // Update an existing inventario
        updateInventario: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/inventario/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: [{ type: 'Inventario', id }],
        }),

        // Delete an inventario
        deleteInventario: builder.mutation({
            query: (id) => ({
                url: `/inventario/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Inventario', id: 'LIST' }],
        }),

        // Fetch all inventario-producto relationships
        getInventariosProductos: builder.query({
            query: () => '/inventario/productos',
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: [{ type: 'InventarioProducto', id: 'LIST' }],
        }),

        // Update the cantidad in inventario-producto
        updateCantidadInventarioProducto: builder.mutation({
            query: ({ id_inventario, id_producto, cantidad }) => ({
                url: `/inventario/${id_inventario}/producto/${id_producto}`,
                method: 'PUT',
                body: { cantidad },
            }),
            invalidatesTags: [{ type: 'InventarioProducto', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetInventariosQuery,
    useGetInventarioByIdQuery,
    useCreateInventarioMutation,
    useUpdateInventarioMutation,
    useDeleteInventarioMutation,
    useGetInventariosProductosQuery,
    useUpdateCantidadInventarioProductoMutation,
} = inventarioApiSlice;
