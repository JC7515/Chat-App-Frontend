import { configureStore } from "@reduxjs/toolkit";
import contactsListSlice from "./features/contactsListSlice";
import groupChatsListSlice from "./features/groupChatsListSlice";
import userDataSlice  from "./features/userDataSlice";

export const store = configureStore({
    reducer: {
        userDataSlice,
        contactsListSlice,
        groupChatsListSlice
    }
}) 


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch