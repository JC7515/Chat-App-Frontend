import { contactBody } from "@/components/types";
import { createSlice } from "@reduxjs/toolkit";


const initialState: contactBody[] = [
    {
        contact_id: '',
        user_id: undefined,
        contact_user: {
            user_id: undefined,
            socket_id: undefined,
            username: '',
            profile_picture: undefined,
            contact_icon: undefined,
            status: undefined,
            contact_blocked_you: undefined
        },
        chat_id: undefined,
        is_blocked: undefined,
        is_contact_validated: true,
        creation_date: undefined,
        notifications_number: undefined,
    }

]

export const contactsListSlice = createSlice({
    name: 'contactsList',
    initialState,
    reducers: {
        updatecontactsList: (state: any, payload) => {
            state = payload
        }
    }
})


export const { updatecontactsList } = contactsListSlice.actions
export default contactsListSlice.reducer 