import { bodyUserData, contactBody, groupData } from "@/components/types";
import { createSlice } from "@reduxjs/toolkit";


interface initialStateSlice {
    data: groupData
}


const initialState: initialStateSlice = {
    data: {
        group_id: '',
        chat_id: '',
        group_name: '',
        description: '',
        group_picture: '',
        group_icon: '',
        invitation_id: '',
        group_password: '',
        members: [{
            group_id: '',
            invitation_id: '',
            role: '',
            status: '',
            user: {
                name: '',
                profile_picture: '',
                socket_id: '',
                user_id: '',
                username: '',
            }
        }],
    }
}


export const groupDataSlice = createSlice({
    name: 'groupData',
    initialState,
    reducers: {
        updateGroupData: (state, action) => {
            state.data = action.payload
        }
    }
})


export const { updateGroupData } = groupDataSlice.actions
export default groupDataSlice.reducer 