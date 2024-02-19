import { bodyUserData } from "@/components/types";
import { createSlice } from "@reduxjs/toolkit";


// {
//     user_id: '',
//     username: '',
//     name: '...',
//     biography: '...',
//     phone: '...',
//     email: '...',
//     profile_picture: '/',
//     create_at: new Date(),
//     chat_id: '',
//     chat_type: ''
// }

interface initialStateSlice {
    data: bodyUserData
}


// const initialState: initialStateSlice = {
//     data: {
//         user_id: '',
//         username: '',
//         name: '...',
//         biography: '...',
//         phone: '...',
//         email: '...',
//         profile_picture: '/',
//         create_at: new Date().toISOString(),
//         chat_id: '',
//         chat_type: ''
//     }
// }


const initialState: initialStateSlice = {
    data: {
        user_id: '',
        username: '',
        name: '...',
        biography: '...',
        phone: '...',
        email: '...',
        profile_picture: '/',
        create_at: new Date().toISOString(),
        chat_id: '',
        chat_type: ''
    }
}


export const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        updateUserData: (state, action) => {
            state.data = action.payload
        }
    }
})


export const { updateUserData } = userDataSlice.actions
export default userDataSlice.reducer 