import { apiSlice } from "../../app/api/apiSlice";

export const categoriasApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getCategorias: builder.query({
            query: () => '/categorias',
            transformResponse: (responseData) => {

                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Categoria', id: 'LIST' },
                        ...result.map(({ id_categoria }) => ({ type: 'Categoria', id: id_categoria })),
                    ];
                } else return [{ type: 'Categoria', id: 'LIST' }];
            },
        }),

        getCategoriaById: builder.query({
            query: (id) => `/categorias/${id}`,
            transformResponse: (responseData) => {
              // Transforma la respuesta si es necesario, o simplemente devuelve los datos directamente.
              return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'Categoria', id: 'LIST' }],
          }),

        createCategoria: builder.mutation({
            query: (newService) => ({
                url: '/categorias',
                method: 'POST',
                body: newService,
            }),
            invalidatesTags: [{ type: 'Categoria', id: 'LIST' }],
        }),

        deleteCategoria: builder.mutation({
            query: (id) => ({
                url: `/categorias/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Categoria', id: 'LIST' }],
        }),

        updateCategoria: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/categorias/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: [{ type: 'Categoria', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetCategoriasQuery,
    useGetCategoriaByIdQuery,
    useCreateCategoriaMutation,
    useDeleteCategoriaMutation,
    useUpdateCategoriaMutation,
} = categoriasApiSlice;
