import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MessageBoxState = {
    type: 'info' | 'warning' | 'error' | 'success';
    description: string;
    duration: number;
    isOpened: boolean;
};

export const initialMessageBoxState: MessageBoxState = {
    type: 'info',
    description: '',
    duration: 0,
    isOpened: false
};

const messageBoxSlice = createSlice({
    name: "messageBox",
    initialState: initialMessageBoxState,
    reducers:{
        setMessageBox: (
            state,
            action: PayloadAction<{
                type: 'info' | 'warning' | 'error' | 'success';
                description: string;
                duration: number;
                isOpened?: boolean;
            }>
        ) => {
            state.type = action.payload.type;
            state.description = action.payload.description;
            state.duration = action.payload.duration;
            if(action.payload.isOpened !== undefined){
                state.isOpened = action.payload.isOpened;
            }
        },
        setIsOpened: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isOpened = action.payload;
        }
    }
})

export const { setMessageBox, setIsOpened } = messageBoxSlice.actions;
export default messageBoxSlice.reducer;