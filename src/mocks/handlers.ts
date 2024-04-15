import { GROUP_CHAT } from '@/components/forChats/ChatsContent.data'
import { bodyMessageToShowInView, bodyUserData, chatBody, chatParticipantBody, contactBody, contactData, groupBody, groupData, memberBody } from '@/components/types'
import { http, HttpResponse } from 'msw'
import { NEXT_PUBLIC_API_URL_DEV } from '../../configEnv'


export const mockUserData: bodyUserData = {
    user_id: '123',
    username: 'userTest',
    name: 'UserTest',
    biography: 'this is a user test',
    phone: '123456789',
    email: 'userTest.123@gmail.com',
    profile_picture: '/image',
    create_at: new Date().toISOString(),
    chat_id: '',
    chat_type: '',
}


export const mockUserContact: bodyUserData = {
    user_id: '1234',
    username: 'contactUserTest',
    name: 'ContactUserTest',
    biography: 'this is a Contact user test',
    phone: '123456788',
    email: 'contactUserTest.123@gmail.com',
    profile_picture: '/image',
    create_at: new Date().toISOString(),
    chat_id: '',
    chat_type: '',
}

export const TestMessage = 'Test Message'

export const TestGroupData = {
    name: 'TestGroup',
    password: '123456789',
    description: 'Test Group Description'
}


export const mockGroupMember = {
    group_id: '1',
    invitation_id: 'invitationId123',
    role: 'member',
    status: 'active',
    user: {
        name: mockUserData.name,
        profile_picture: mockUserData.profile_picture,
        socket_id: 'socketIdTest',
        user_id: mockUserData.user_id,
        username: mockUserData.username,
    }
}


export const NewTestGroup: groupBody = {
    group: {
        group_id: '1',
        chat_id: '2',
        group_name: 'TestGroup',
        description: 'Test Group Description',
        group_picture: '/',
        group_icon: 'TG',
        invitation_id: 'invitationId123',
        group_password: '123456789',
        members: [mockGroupMember],
    },
    notifications_number: 0,
    role: 'admin',
    user_id: mockUserData.user_id,
}


export const mockUserContactData: contactData = {
    user_id: mockUserContact.user_id,
    socket_id: 'testSocketId',
    username: mockUserContact.username,
    profile_picture: '',
    contact_icon: 'TC',
    status: 'active',
    contact_blocked_you: false,
    was_User_Deleted_By_His_Contact: false
}

export const NewTestContact: contactBody = {
    contact_id: '12345',
    user_id: mockUserData.user_id,
    contact_user: mockUserContactData,
    chat_id: '3',
    is_blocked: false,
    is_contact_validated: true,
    creation_date: new Date().toISOString()
}




export const mockChatData: chatBody = {
    chat_id: NewTestGroup.group.chat_id,
    name: NewTestGroup.group.group_name,
    type: GROUP_CHAT,
    last_update: new Date().toISOString()
}

export const mockChatParticipantData: chatParticipantBody = {
    user_id: mockUserData.user_id,
    status: 'active',
    username: mockUserData.username,
    union_date: new Date().toISOString(),
    message_type: 'text',
    timestamp: new Date(),
}


export const mockedGroupData: groupData = {
    group_id: NewTestGroup.group.group_id,
    chat_id: NewTestGroup.group.chat_id,
    group_name: NewTestGroup.group.group_name,
    description: NewTestGroup.group.description,
    group_picture: NewTestGroup.group.group_picture,
    group_icon: NewTestGroup.group.group_icon,
    invitation_id: NewTestGroup.group.invitation_id,
    group_password: NewTestGroup.group.group_password,
    members: [mockGroupMember],
}

export const testMessage: bodyMessageToShowInView = {
    message_id: '101',
    chat_id: NewTestGroup.group.chat_id,
    user_id: mockUserData.user_id,
    username: mockUserData.username,
    date: new Date().toISOString(),
    hour: new Date().getHours.toString(),
    message_content: TestMessage,
    profile_picture: mockUserData.profile_picture,
    message_type: 'text',
    timestamp: new Date(),
    is_current_user_messsage: true,
    is_read: true
}


export const contactChatList: contactBody[] = []

export const groupChatList: groupBody[] = []

export const memberList: memberBody[] = []

export const chatParticipantList: chatParticipantBody[] = []

export const chatMessagesList: bodyMessageToShowInView[] = []

export const userFoundsList: bodyUserData[] = []


// console.log(NEXT_PUBLIC_API_URL_DEV)

export const handlers = [
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/auth/profile`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: mockUserData
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/notifications`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                notifications_list: []
            }
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/groups`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                groups_list: groupChatList
            }
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/contacts/list`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                contacts_list: contactChatList
            }
        })
    }),
    http.post(`${NEXT_PUBLIC_API_URL_DEV}/v1/groups`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                groups_list: groupChatList
            }
        })
    }),
    http.put(`${NEXT_PUBLIC_API_URL_DEV}/v1/chatParticipant/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK"
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/members/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                members_list: memberList
            }
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/groups/chatParticipant/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                chat_data: mockChatData,
                chat_participants: chatParticipantList,
            }
        })
    }),
    http.delete(`${NEXT_PUBLIC_API_URL_DEV}/v1/all/notifications/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK"
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/group/messages/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                messages: chatMessagesList,
            }
        })
    }),
    http.delete(`${NEXT_PUBLIC_API_URL_DEV}/v1/members/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK"
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/users/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                list_usersFound: userFoundsList,
            }
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/validateMembers/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                members_list: memberList,
            }
        })
    }),
    http.post(`${NEXT_PUBLIC_API_URL_DEV}/v1/contacts/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK"
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/contacts/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                contact_data: NewTestContact
            }
        })
    }),
    http.get(`${NEXT_PUBLIC_API_URL_DEV}/v1/contact/messages/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK",
            data: {
                messages: chatMessagesList
            }
        })
    }),
    http.delete(`${NEXT_PUBLIC_API_URL_DEV}/v1/contacts/`, () => {
        // Note that you DON'T have to stringify the JSON!
        return HttpResponse.json({
            status: "OK"
        })
    }),
        
    
]

