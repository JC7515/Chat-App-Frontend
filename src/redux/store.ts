import { configureStore } from "@reduxjs/toolkit";
import contactDataSlice  from "./features/contactData";
import contactsListSlice from "./features/contactsListSlice";
import groupChatsListSlice from "./features/groupChatsListSlice";
import groupDataSlice  from "./features/groupData";
import userDataSlice  from "./features/userDataSlice";

export const store = configureStore({
    reducer: {
        userDataSlice: userDataSlice,
        contactsListSlice: contactsListSlice,
        groupChatsListSlice: groupChatsListSlice,
        contactDataSlice: contactDataSlice,
        groupDataSlice: groupDataSlice
    }
}) 


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch