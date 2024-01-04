import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: {
        user_id: '',
        username: '',
        name: '...',
        biography: '...',
        phone: '...',
        email: '...',
        profile_picture: '/',
        create_at: new Date(),
        chat_id: '',
        chat_type: ''
    } 
}

export const userDataSlice= createSlice({
    name: 'userData',
    initialState,
    reducers: {
        updateUserData: (state: any, payload: any) => {
            state.data = [...state.userData, ...payload]
        }
    }
})


export const {updateUserData} = userDataSlice.actions
export default userDataSlice.reducer 