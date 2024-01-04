import { ACCESS_TOKEN_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_NAME } from "@/components/forLogin/authCard/AuthCard.data"
import { bodyUserData } from "@/components/types"
import { CookieSerializer, GetCookieValue } from "@/helpers"
import { v4 as uuidv4 } from "uuid"


export const GetAllMessagesFromAChat = async (chatId: any, messagesLimit:any, creationDate:any) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/messages/?chatId=${chatId}&messagesLimit=${messagesLimit}&creationDate=${creationDate}`
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

        return data.data.messages
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
        }

        return userdata
    } catch (error) {
        throw error
    }
}




export const GetNewAccessToken = async () => {

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
    const listOfNewCookies = [
        { name: ACCESS_TOKEN_NAME, value: accessTokenValue },
        { name: REFRESH_TOKEN_NAME, value: refreshTokenValue }
    ]

    // Serializamos los nuevos token
    CookieSerializer(listOfNewCookies, COOKIE_OPTIONS)

    return accessTokenValue
}


export const GetlistOfUserByUsername = async (username: any, offset: any, limit: any) => {
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

        return data.data.list_usersFound

    } catch (error) {
        throw error
    }

}


export const GetAllGroupChats = async () => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups/`
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

        return data.data.groups_list

    } catch (error) {
        throw error
    }

}


export const GetAllMembersOfGroup = async (groupId: any) => {
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

        return data.data.members_list
        
    } catch (error) {
        throw error
    }

}



export const GetAllChatParticipants = async (chatId: any) => {
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

        return data.data
        
    } catch (error) {
        throw error
    }

}


export const CreateNewChatNotification = async (messageData: any) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)
        
        const payload = {
            message_id: messageData.message_id,
            user_id: messageData.user_id,
            chat_id: messageData.chat_id,
            group_id: messageData.group_id,
            type: messageData.message_type,
            message: messageData.message_content,
            status: 'unread',
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/notifications`

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

        return data.data.notification_id
        
    } catch (error) {
        throw error
    }

}



export const DeleteANotification = async (messageData: any) => {
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
        // throw error
    }

}

export const DeleteAllNotifications = async (chat_id: any) => {
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
        // throw error
    }

}



export const GetAllNotificationsOfGroup = async () => {
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

        return data.data.notifications_list
        
    } catch (error) {
        // throw error
        console.log(error)
    }

}


export const GetAllNotificationsOfChat = async (chat_id: any) => {
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

        return data.data.notifications_list
        
    } catch (error) {
        // throw error
        console.log(error)
    }

}


export const ChangeStatusToActiveInChat = async (chatId: any) => {
    try {
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups/chatParticipant/?chat_id=${chatId}`

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${accessToken}`,
            }
        })

        const data = await resp.json()

        if (data.status === "FAILED") {
            // si falla la peticion devolveremos el valor de data.data que ese error.message
            throw data.data // { error: { message: 'error...'} }
        }   

        return data.data
        
    } catch (error) {
        throw error
    }

}


export const UpdateSocketIdOfUser = async (socketId: any) => {
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



export const UpdateStatusOfChatParticipant = async (chatId: any, participantId: any, newStatus: any ) => {
    try {

        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/groups/chatParticipant/?chatId=${chatId}&participantId=${participantId}&newStatus=${newStatus}`

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



export const ChangeMemberToAdmin = async (userId: any, groupId: any) => {
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

export const DeleteMemberOfGroup = async (userId: any, groupId: any, chatId: any) => {
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


export const PermanentlyDeleteGroup = async (chatId: any, groupId: any) => {
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



export const filterItems = (query: any, items: any) => {
    if(query === ''){
        return items
    }

    return items.filter((item: any) => item.group.group_name.indexOf(query) === 0 )
}
