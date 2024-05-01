import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Retain this for user details
        token: null, // For regular auth token

    },
    reducers: {
        setCredentials: (state, action) => {
            const { user,accessToken } = action.payload
            state.token = accessToken
            state.user = user;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },
    }
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;

