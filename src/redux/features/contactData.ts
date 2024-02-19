import { bodyUserData, contactBody } from "@/components/types";
import { createSlice } from "@reduxjs/toolkit";


interface initialStateSlice {
    data: contactBody
}


const initialState: initialStateSlice = {
    data: {
        contact_id: '',
        user_id: '',
        contact_user: {
            user_id: '',
            socket_id: undefined,
            username: '',
            profile_picture: undefined,
            contact_icon: undefined,
            status: undefined,
            contact_blocked_you: undefined
        },
        chat_id: '',
        is_blocked: undefined,
        is_contact_validated: true,
        creation_date: '',
        notifications_number: undefined,
    }
}


export const contactDataSlice = createSlice({
    name: 'contactData',
    initialState,
    reducers: {
        updateContactData: (state, action) => {
            state.data = action.payload
        }
    }
})


export const { updateContactData } = contactDataSlice.actions
export default contactDataSlice.reducer 