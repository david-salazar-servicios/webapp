import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({ // Cambia de mutation a query si solo estás obteniendo datos.
            query: () => '/usuarios', // Simplificado para solo URL, asumiendo GET por defecto.
            transformResponse: (responseData) => {
                // Aquí asumo que responseData ya es un array de tus servicios.
                // No necesitas mapearlos uno por uno si solo los devuelves tal cual.
                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Usuario', id: 'LIST' },
                        ...result.map(({ id_usuario }) => ({ type: 'Usuario', id: id_usuario })),
                    ];
                } else return [{ type: 'Usuario', id: 'LIST' }];
            },
        }),

        // Tus otros endpoints aquí...
        createUser: builder.mutation({
            query: (newService) => ({
                url: '/usuarios',
                method: 'POST',
                body: newService,
            }),
            invalidatesTags: [{ type: 'Usuario', id: 'LIST' }],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/usuarios/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Usuario', id: 'LIST' }],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/usuarios/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: [{ type: 'Usuario', id: 'LIST' }],
        }),
        getUserById: builder.query({
            query: (id) => `/usuarios/${id}`,
            transformResponse: (responseData) => {
                // Transforma la respuesta si es necesario, o simplemente devuelve los datos directamente.
                return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'Usuario', id: 'LIST' }],
        }),

        getUserRole: builder.query({
            query: (id_usuario) => `/usuarios/${id_usuario}/roles`,
            providesTags: (result, error, id_usuario) => [{ type: 'Usuario', id: id_usuario }],
        }),

        assignRoleToUser: builder.mutation({
            query: ({ id_usuario, id_rol }) => ({
                url: `/usuarios/${id_usuario}/roles`, // Asume que esta es la URL para asignar roles en tu API
                method: 'POST',
                body: { id_rol }, // Envía solo id_rol, ya que id_usuario está en la URL
            }),
            invalidatesTags: [{ type: 'Usuario', id: 'LIST' }], // Asume que quieres invalidar la lista de usuarios
        }),

        updateUserRole: builder.mutation({
            query: ({ id_usuario, roles }) => ({
                url: `/usuarios/${id_usuario}/roles`, // Asegúrate de que esta es la ruta correcta en tu API
                method: 'PUT',
                body: { roles },
            }),
            invalidatesTags: (result, error, { id_usuario }) => [{ type: 'Usuario', id: 'LIST' }, { type: 'Usuario', id: id_usuario }], // Asegúrate de que se accede correctamente
        }),


        // Continúan los otros endpoints...
    }),
});

// Exporta los hooks generados automáticamente
export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUserByIdQuery,
    useAssignRoleToUserMutation,
    useGetUserRoleQuery,
    useUpdateUserRoleMutation
} = usersApiSlice;
