import { groupBody } from "@/components/types";
import { createSlice } from "@reduxjs/toolkit";


const initialState: groupBody[] = [
    {
        group: {
            group_id: '',
            chat_id: '',
            group_name: '',
            description: '',
            group_picture: '',
            group_icon: '',
            invitation_id: '',
            group_password: '',
            members: [],
        }
    }
]

export const groupChatsListSlice= createSlice({
    name: 'groupChatsList',
    initialState,
    reducers: {
        updateGroupChatList: (state: any, payload) => {
            state = payload
        }
    }
})


export const { updateGroupChatList } = groupChatsListSlice.actions
export default groupChatsListSlice.reducer 