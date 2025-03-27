import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseStoreApi } from "../StoreApi"

export type AdminTypes = {
    SA: "SuperAdmin",
    A: "Admin"
}

export type AdminState = {
    id: string;
    adminname: string;
    isAuth: boolean;
    type: keyof AdminTypes;
    status: {
        pending:boolean,
        success: boolean,
        failed:boolean
    }
};

export const initialAdminState: AdminState = {
    id: '',
    adminname: '',
    isAuth: false,
    type:"A",
    status: {
        pending: false,
        success: false,
        failed: false
    }
};

const adminSlice = createSlice({
    name: "admin",
    initialState: initialAdminState,
    reducers: {
        setAdmin: (
        state,
        action: PayloadAction<{
            id: string;
            adminname: string;
            type: "A" | "SA";
            isAuth: boolean;
        }>
        ) => {
            state.id = action.payload.id;
            state.adminname = action.payload.adminname;
            state.isAuth = action.payload.isAuth;
            state.type = action.payload.type;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                BaseStoreApi.endpoints.fetchAdmin.matchFulfilled,
                (state, { payload }) => {
                    console.log(payload)
                    state.status.pending = false;
                    state.status.success = true;
                    state.status.failed = false;
                    state.id = payload.sa.id;
                    state.isAuth = true;
                    state.adminname = payload.sa.supername;
                    state.type = "SA";
                }
            )
            .addMatcher(
                BaseStoreApi.endpoints.fetchAdmin.matchRejected,
                (state) => {
                    state.isAuth = false;
                    state.status.pending = false;
                    state.status.success = false;
                    state.status.failed = true;
                }
            );
    },
});

export const { setAdmin } = adminSlice.actions;
export default adminSlice.reducer;