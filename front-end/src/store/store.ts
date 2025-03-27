import { configureStore, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { BaseStoreApi } from "./StoreApi";
import userProfileSlice from "./Slices/profileUser.slice";
import messageBoxSlice from "./Slices/messageBox.slice"
import adminSlice from "./Slices/admin.slice";
import notifionsSlice from "./Slices/notifications.slice";

export const extraArgument = {
    BaseStoreApi,
}

const store = configureStore({
    reducer: {
        userProfile: userProfileSlice,
        messageBox: messageBoxSlice,
        admin: adminSlice,
        notifications: notifionsSlice,
        [BaseStoreApi.reducerPath]: BaseStoreApi.reducer
    },

    middleware: (getDefMidd) => 
        getDefMidd({
            thunk:{
                extraArgument:extraArgument
            }
        }).concat(
            BaseStoreApi.middleware
        )
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state:AppState,
    dispatch:AppDispatch,
    extra:typeof extraArgument
}>

export default store;