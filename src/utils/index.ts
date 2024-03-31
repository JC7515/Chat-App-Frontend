import { ACCESS_TOKEN_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_NAME } from "@/components/forLogin/authCard/AuthCard.data"
import { addNewMemberToGroupResponseBody, bodyMessageFromBackendForChat, bodyMessageToShowInView, bodyUserData, contactBody, CookiesBody, createNewGroupResponseBody, groupBody, memberBody, messageBodyForContactSocketEvent, messageBodyForGroupSocketEvent, messagesBodyFromBackend, notificationBody, obtainedChatParticipantsObjectBody, propBodyToAddNewMemberToAGroup, propBodyToCreateANewGroup, validatedEmailUser } from "@/components/types"
import { CookieSerializer, GetCookieValue } from "@/helpers"
import { AnyARecord } from "dns"
import { v4 as uuidv4 } from "uuid"


export const GetAllMessagesFromAGroupChat = async (chatId: string, messagesLimit: number, creationDate: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/group/messages/?chatId=${chatId}&messagesLimit=${messagesLimit}&creationDate=${creationDate}`
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const messagesList: messagesBodyFromBackend[] = data.data.messages

        return messagesList

    } catch (error) {
        throw error
    }

}

export const GetAllMessagesFromAContactChat = async (chatId: string, messagesLimit: number, creationDate: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contact/messages/?chatId=${chatId}&messagesLimit=${messagesLimit}&creationDate=${creationDate}`
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const messagesList: messagesBodyFromBackend[] = data.data.messages

        return messagesList

    } catch (error) {
        throw error
    }

}


export const CreateBlockContact = async (userId: string,contactUserId: string, blockStatus: string, chatId: string, blockDate: string | Date) => {

    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const payload = {
            userId: userId,
            contactUserId: contactUserId,
            blockStatus: blockStatus,
            chatId: chatId,
            blockDate: blockDate,
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/blocks`

        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }


}





export const DeleteContactChatHistory = async (chatId: string) => {

    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const payload = {
            chatId: chatId
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contact/chathistoryDeletions`

        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }


}


export const DeleteContact = async (chatId: string, contactUserId: string) => {

    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contacts/?chatId=${chatId}&contactUserId=${contactUserId}`

        const resp = await fetch(url, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }


}




export const GetUserDataValidated = async () => {
    try {

        let accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        console.log(accessToken)

        if (!accessToken) {
            // aqui iria un toas notification 

            //    throw (`${ACCESS_TOKEN_NAME} not found`)
            // aqui logica para obtener un nuevo accessToken a travez del token refresh
            const newAccessToken = await GetNewAccessToken()

            // si newAccessToken tiene la propiedad de error se ejecutar un throw y saldra del flujo
            if (newAccessToken.error) {
                throw { error: { message: newAccessToken.error.message } }
            }

            accessToken = newAccessToken

        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/auth/profile`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            throw ('Could not retrieve user profile information, please reload the page.')
        }

        const user = data.data

        const userdata: bodyUserData = {
            user_id: user.user_id,
            username: user.username,
            name: user.name,
            biography: user.biography,
            phone: user.phone,
            email: user.email,
            profile_picture: user.profile_picture,
            create_at: user.create_at,
            chat_id: '',
            chat_type: '',
        }

        return userdata

    } catch (error) {
        console.log(error)
        throw error
    }
}




export const VerifyUserEmailValidationToken = async (token: string) => {
    try {


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/verifyEmail`
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            throw undefined
        }

        const user = data.data

        const obtainedEmail: validatedEmailUser = {
            email: user.email
        }

        return obtainedEmail
    } catch (error) {
        return error
    }
}


export const ResendVerifyEmail = async (emailToResendValidation: string) => {
    try {

        const payload = {
            email: emailToResendValidation
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/resendVerifyEmail`

        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error.message // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }

        const resultingMessage: string = data.data.message

        return resultingMessage

    } catch (error) {
        throw error
    }
}



export const GetNewAccessToken = async () => {
    try {

        const refresh_token = GetCookieValue(REFRESH_TOKEN_NAME)

        if (!refresh_token) return { error: { message: 'the refresh token was not found' } }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/auth/newAccessToken`
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${refresh_token}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            return data.data // { error: { message: 'error...'} }
        }

        console.log(data.data.access_token)
        console.log(data.data.refresh_token)

        // Obetenemos los valores de nuestros nuevos access_token y refresh_token
        const accessTokenValue: string = data.data.access_token
        const refreshTokenValue: string = data.data.refresh_token


        // Lista de cokkies a serializar
        const listOfNewCookies: CookiesBody[] = [
            { name: ACCESS_TOKEN_NAME, value: accessTokenValue },
            { name: REFRESH_TOKEN_NAME, value: refreshTokenValue }
        ]

        // Serializamos los nuevos token
        CookieSerializer(listOfNewCookies, COOKIE_OPTIONS)

        return accessTokenValue

    } catch (error) {
        console.log(error)
        throw error
    }

}


export const GetlistOfUserByUsername = async (username: string, offset: number, limit: number) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/users/?usernameToSearch=${username}&offset=${offset}&limit=${limit}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const listOfFoundUsers: bodyUserData[] = data.data.list_usersFound

        return listOfFoundUsers

    } catch (error) {
        throw error
    }

}


export const GetAllGroupChats = async () => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups`
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const groups_list: groupBody[] = data.data.groups_list
        return groups_list

    } catch (error) {
        throw error
    }

}


export const GetAllMembersOfGroup = async (groupId: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/members/?group_id=${groupId}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const membersList: memberBody[] = data.data.members_list

        return membersList

    } catch (error) {
        throw error
    }

}

export const ValidateMembersOfGroup = async (groupId: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/validateMembers/?group_id=${groupId}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const membersList: memberBody[] = data.data.members_list

        return membersList

    } catch (error) {
        throw error
    }

}



export const GetAllChatParticipantsOfGroup = async (chatId: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups/chatParticipant/?chat_id=${chatId}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const result: obtainedChatParticipantsObjectBody = data.data

        return result

    } catch (error) {
        throw error
    }

}



export const GetAllChatParticipantsOfContact = async (chatId: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contact/chatParticipant/?chat_id=${chatId}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const result: obtainedChatParticipantsObjectBody = data.data

        return result

    } catch (error) {
        throw error
    }

}


export const CreateNewGroupChatNotification = async (messageData: messageBodyForGroupSocketEvent) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const payload = {
            message_id: messageData.message_id,
            user_id: messageData.user_id,
            chat_id: messageData.chat_id,
            group_id: messageData.group_id,
            type: messageData.message_type,
            chat_type: messageData.chat_type,
            message: messageData.message_content,
            status: 'unread',
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/group/notifications`

        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }


        const notificationId: string = data.data.notification_id

        return notificationId

    } catch (error) {
        throw error
    }

}


export const CreateNewContactChatNotification = async (messageData: messageBodyForContactSocketEvent) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const payload = {
            message_id: messageData.message_id,
            user_id: messageData.user_id,
            chat_id: messageData.chat_id,
            type: messageData.message_type,
            chat_type: messageData.chat_type,
            message: messageData.message_content,
            status: 'unread',
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contact/notifications`

        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }

        const notificationId: string = data.data.notification_id

        return notificationId

    } catch (error) {
        throw error
    }

}



export const DeleteANotification = async (messageData: bodyMessageToShowInView) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/notifications/?messageId=${messageData.message_id}`

        const resp = await fetch(url, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        console.log(error)
        throw error
    }

}

export const DeleteAllNotifications = async (chat_id: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/all/notifications/?chat_id=${chat_id}`

        const resp = await fetch(url, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data.error // { message: 'error...'} }
            // throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        console.log(error)
        throw error
    }

}



export const GetAllNotificationsOfUser = async () => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/notifications`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const notificationsList: notificationBody[] = data.data.notifications_list

        return notificationsList

    } catch (error) {
        console.log(error)
        throw error
    }

}


export const GetAllNotificationsOfChat = async (chat_id: string) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/all/notifications/?chat_id=${chat_id}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const notificationsList: notificationBody[] = data.data.notifications_list

        return notificationsList


    } catch (error) {
        console.log(error)
        throw error

    }

}


// export const ChangeStatusToActiveInChat = async (chatId: string) => {
//     try {
//         const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

//         const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups/chatParticipant/?chat_id=${chatId}`

//         const resp = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'authorization': `Bearer ${accessToken}`,
//             }
//         })

//         const data = await resp.json()

//         if (data.status === "FAILED") {
//             // si falla la peticion devolveremos el valor de data.data que ese error.message
//             throw data.data // { error: { message: 'error...'} }
//         }

//         return data.data

//     } catch (error) {
//         throw error
//     }

// }


export const UpdateSocketIdOfUser = async (socketId: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/users/socketId/?newSocketId=${socketId}`

        const resp = await fetch(url, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }

}




export const UpdateStatusOfChatParticipant = async (chatId: string, participantId: string, newStatus: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/chatParticipant/?chatId=${chatId}&participantId=${participantId}&newStatus=${newStatus}`

        const resp = await fetch(url, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }

}



export const ChangeMemberToAdmin = async (userId: string, groupId: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const role = 'admin'

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/members/?userId=${userId}&groupId=${groupId}&role=${role}`

        const resp = await fetch(url, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }

}

export const DeleteMemberOfGroup = async (userId: string, groupId: string, chatId: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/members/?userId=${userId}&groupId=${groupId}&chatId=${chatId}`

        const resp = await fetch(url, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }

}


export const PermanentlyDeleteGroup = async (chatId: string, groupId: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups/?chatId=${chatId}&groupId=${groupId}`

        const resp = await fetch(url, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }

}

export const CreateNewContact = async (contactUserId: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const payload = {
            contact_user_id: contactUserId
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contacts/`

        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }

}

export const GetAllContacts = async () => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contacts/list`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }


        const contactsList: contactBody[] = data.data.contacts_list

        return contactsList

    } catch (error) {
        throw error
    }

}


export const GetContactChatData = async (chatId: string, contactUserId: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contacts/?chatId=${chatId}&contactUserId=${contactUserId}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }


        const contactData: contactBody = data.data.contact_data

        return contactData


    } catch (error) {
        throw error
    }

}





export const GetContactBlock = async (contactUserId: string, chatId: string) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/contact/blocks/?contactUserId=${contactUserId}&chatId=${chatId}`

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        const isContactBlocked: boolean = data.data.is_Contact_Blocked

        return isContactBlocked

    } catch (error) {
        throw error
    }

}



export const UpdateMessageData = async (messageId: string, newReadStatus: boolean, newReadTimestamp: string | Date) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/messages/?messageId=${messageId}&newReadStatus=${newReadStatus}&newReadTimestamp=${newReadTimestamp}`

        const resp = await fetch(url, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }

        return true

    } catch (error) {
        throw error
    }

}



export const filterItems = (query: string, items: any) => {
    if (query === '') {
        return items
    }

    return items.filter((item: any) => item.group.group_name.indexOf(query) === 0)
}


export const CreateNewGroup = async (payload: propBodyToCreateANewGroup) => {

    const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

    const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups`

    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })

    const data = await resp.json()

    if (data.data.status === "FAILED") {
        // si falla la peticion devolveremos el valor de data.data que ese error.message
        throw data.data.error // { error: { message: 'error...'} }
    }

    const result: createNewGroupResponseBody = data.data

    return result

}


export const AddANewMemberToAGroup = async (payload: propBodyToAddNewMemberToAGroup) => {


    const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

    const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/members`

    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })

    const data = await resp.json()

    if (data.data.status === "FAILED") {
        // si falla la peticion devolveremos el valor de data.data que ese error.message
        throw data.data.error // { error: { message: 'error...'} }
    }

    const result: addNewMemberToGroupResponseBody = data.data

    return result

}






