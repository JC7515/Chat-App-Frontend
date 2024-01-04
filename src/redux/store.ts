import { configureStore } from "@reduxjs/toolkit";
import userDataSlice  from "./features/userDataSlice";

export const store = configureStore({
    reducer: {
        userDataSlice
    }
}) 


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch