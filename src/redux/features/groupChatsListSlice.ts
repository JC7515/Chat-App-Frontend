import { groupBody } from "@/components/types";
import { createSlice } from "@reduxjs/toolkit";



interface initialStateSlice {
    data: groupBody[]
}

const initialState: initialStateSlice = {
    data: [
        // {
        //     group: {
        //         group_id: '',
        //         chat_id: '',
        //         group_name: '',
        //         description: '',
        //         group_picture: '',
        //         group_icon: '',
        //         invitation_id: '',
        //         group_password: '',
        //         members: [],
        //     },
        //     notifications_number: 0,
        // }
    ]
}


// const initialState: groupBody[] = []


export const groupChatsListSlice = createSlice({
    name: 'groupChatsList',
    initialState,
    reducers: {
        updateGroupChatList: (state, action) => {
            state.data = action.payload
        }
    }
})


export const { updateGroupChatList } = groupChatsListSlice.actions
export default groupChatsListSlice.reducer 