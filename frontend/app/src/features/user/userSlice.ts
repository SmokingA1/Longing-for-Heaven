import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    phone_number: string | null;
    avatar_url: string | null;
    country: string | null;
    city: string | null;
    street: string | null;
}

const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    phone_number: null,
    avatar_url: null,
    country: null,
    city: null,
    street: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone_number = action.payload.phone_number;
            state.avatar_url = action.payload.avatar_url;
            state.country = action.payload.country;
            state.city = action.payload.city;
            state.street = action.payload.street;
        },
        clearUser(state) {
            state.id = null;
            state.name = null;
            state.email = null;
            state.phone_number = null;
            state.avatar_url = null;
            state.country = null;
            state.city = null;
            state.street = null;
        },
    },
});

export const {setUser, clearUser} = userSlice.actions
export default userSlice.reducer