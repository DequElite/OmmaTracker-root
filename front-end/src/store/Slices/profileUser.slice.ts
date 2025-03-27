import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseStoreApi } from "../StoreApi"

export type UserProfileState = {
    id: string;
    username: string;
    email:string;
    isAuth: boolean;
    status: {
        pending:boolean,
        success: boolean,
        failed:boolean
    }
};

export const initialUserProfileState: UserProfileState = {
    id: '',
    username: '',
    email: '',
    isAuth: false,
    status: {
        pending: false,
        success: false,
        failed: false
    }
};

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: initialUserProfileState,
    reducers: {
        setUserProfile: (
        state,
        action: PayloadAction<{
            id: string;
            username: string;
            email: string;
            isAuth: boolean;
        }>
        ) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.isAuth = action.payload.isAuth;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                BaseStoreApi.endpoints.fetchProfileUser.matchFulfilled,
                (state, { payload }) => {
                    state.status.pending = false;
                    state.status.success = true;
                    state.status.failed = false;
                    state.email = payload.user.email;
                    state.id = payload.user.id;
                    state.username = payload.user.username;
                    state.isAuth = true;
                }
            )
            .addMatcher(
                BaseStoreApi.endpoints.fetchProfileUser.matchRejected,
                (state) => {
                    state.status.pending = false;
                    state.status.success = false;
                    state.status.failed = true;
                }
            );
    },
});

export const { setUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;