import { apiSlice } from "../../app/api/apiSlice";

export const productosApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductos: builder.query({
            query: () => '/productos',  // This should map to your controller route for fetching all productos
            transformResponse: (responseData) => {
                return responseData; // Transform if necessary
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Producto', id: 'LIST' },
                        ...result.map(({ id_producto }) => ({ type: 'Producto', id: id_producto })),
                    ];
                } else return [{ type: 'Producto', id: 'LIST' }];
            },
        }),

        getProductoById: builder.query({
            query: (id) => `/productos/${id}`,  // Maps to your controller for fetching a product by ID
            transformResponse: (responseData) => {
                return responseData; // Transform if necessary
            },
            providesTags: (result, error, id) => [{ type: 'Producto', id }],
        }),

        createProducto: builder.mutation({
            query: (newProducto) => ({
                url: '/productos',
                method: 'POST',
                body: newProducto,
            }),
            invalidatesTags: [{ type: 'Producto', id: 'LIST' }],
        }),

        updateProducto: builder.mutation({
            query: ({ id_producto, ...rest }) => ({
                url: `/productos/${id_producto}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: (result, error, { id_producto }) => [{ type: 'Producto', id: id_producto }],
        }),

        deleteProducto: builder.mutation({
            query: (id_producto) => ({
                url: `/productos/${id_producto}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id_producto) => [{ type: 'Producto', id: id_producto }],
        }),
    }),
});

export const {
    useGetProductosQuery,
    useGetProductoByIdQuery,
    useCreateProductoMutation,
    useDeleteProductoMutation,
    useUpdateProductoMutation,
} = productosApiSlice;
