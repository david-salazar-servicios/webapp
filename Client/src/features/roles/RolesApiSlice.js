import { apiSlice } from "../../app/api/apiSlice";

export const rolesApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getRoles: builder.query({
            query: () => '/roles',
            transformResponse: (responseData) => {

                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Roles', id: 'LIST' },
                        ...result.map(({ id_categoria }) => ({ type: 'Roles', id: id_categoria })),
                    ];
                } else return [{ type: 'Roles', id: 'LIST' }];
            },
        }),

        getUsersRoles: builder.query({
            query: () => '/roles/usuarios/all',
            transformResponse: (responseData) => {

                return responseData;
            },
            providesTags: (result, error, arg) => {
                if (result?.length) {
                    return [
                        { type: 'Roles', id: 'LIST' },
                        ...result.map(({ id_categoria }) => ({ type: 'Roles', id: id_categoria })),
                    ];
                } else return [{ type: 'Roles', id: 'LIST' }];
            },
        }),
    
        getRolById: builder.query({
            query: (id) => `/roles/${id}`,
            transformResponse: (responseData) => {
              // Transforma la respuesta si es necesario, o simplemente devuelve los datos directamente.
              return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'Roles', id: 'LIST' }],
          }),

        createRol: builder.mutation({
            query: (newService) => ({
                url: '/roles',
                method: 'POST',
                body: newService,
            }),
            invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
        }),

        deleteRol: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
        }),

        updateRol: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/roles/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: [{ type: 'Roles', id: 'LIST' }, { type: 'Roles', id: 'USERS_ROLES' }],
        }),

    }),
});

export const {
    useGetRolesQuery,
    useGetRolByIdQuery,
    useCreateRolMutation,
    useDeleteRolMutation,
    useUpdateRolMutation,
    useGetUsersRolesQuery
    
} = rolesApiSlice;
