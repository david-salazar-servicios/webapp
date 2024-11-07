import { apiSlice } from "../../app/api/apiSlice";

export const inventarioApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all inventarios
        getInventarios: builder.query({
            query: () => '/inventarios',
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
            query: (id) => `/inventarios/${id}`,
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'Inventario', id }],
        }),

        // Create a new inventario
        createInventario: builder.mutation({
            query: (newInventario) => ({
                url: '/inventarios',
                method: 'POST',
                body: newInventario,
            }),
            invalidatesTags: [{ type: 'Inventario', id: 'LIST' }],
        }),

        // Update an existing inventario
        updateInventario: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/inventarios/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Inventario', id }],
        }),

        // Delete an inventario
        deleteInventario: builder.mutation({
            query: (id) => ({
                url: `/inventarios/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Inventario', id: 'LIST' }],
        }),

        // Fetch all inventario-producto relationships
        getInventariosProductos: builder.query({
            query: () => '/inventarios/productos',
            transformResponse: (responseData) => {
                return responseData;
            },
            providesTags: [{ type: 'InventarioProducto', id: 'LIST' }],
        }),

        updateCantidadInventarioProducto: builder.mutation({
            query: ({ id_inventario, id_producto, cantidad, cantidadRecomendada, action, destino_inventario }) => ({
                url: `/inventarios/${id_inventario}/producto/${id_producto}`,
                method: 'PUT',
                body: {
                    cantidad,
                    cantidadRecomendada,
                    action,
                    destino_inventario
                },
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
