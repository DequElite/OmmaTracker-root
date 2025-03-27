import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotfsType = {
    id: number;
    title: string;
    message: string;
    created_at: Date;
    is_read?: boolean;
    is_global?: boolean;
};

export type NotfsState = {
    notifications: NotfsType[]
}

export const initialNotfsState: NotfsState = {
    notifications: []
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initialNotfsState,
    reducers: {
        addNotification: (state, action: PayloadAction<NotfsType>) => {
            state.notifications.unshift(action.payload);
        },
        markNotificationAsRead: (state, action: PayloadAction<number>) => {
            state.notifications = state.notifications.map(notf => 
                notf.id === action.payload ? { ...notf, is_read: true } : notf
            );
        }
    }
});

export const { addNotification, markNotificationAsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;
