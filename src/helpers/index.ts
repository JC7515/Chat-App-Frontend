import { bodyCookieOptions, bodyMessageToBacked, bodyMessageToNotification, bodyMessageToShowInView, bodyUserData, ChatMessages, chatParticipantBody, contactBody, cookiesZerializerForEachProps, cookiesZerializerProps, groupBody, groupData, memberBody, messageIssueDateBody, messagesBodyFromBackend, notificationBody } from '@/components/types'
import cookie from 'cookie'
import { GetAllContacts, GetAllGroupChats, GetUserDataValidated, ValidateMembersOfGroup } from "@/utils"
import { NextComponentType } from "next"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { GROUP_CHAT } from '@/components/forChats/ChatsContent.data'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/redux/hooks'
import { updateGroupChatList } from '@/redux/features/groupChatsListSlice'
import { AppDispatch } from '@/redux/store'
import { updatecontactsList } from '@/redux/features/contactsListSlice'
import { Toast, ToastType } from 'react-hot-toast'




export const GetCookieValue = (cookieKey: string) => {

    const documentCookie: any = document.cookie
    try {

        if (!documentCookie) throw { error: { message: 'User access cookies not found, please log in' } }

        const cookieFound = documentCookie
            .split('; ')
            .find((cookie: string) => cookie.startsWith(`${cookieKey}=`))

        const value = cookieFound.split('=')[1]

        return value

    } catch (error: any) {
        console.error(`Error al obtener el valor de la cookie ${cookieKey}:`, error);
        console.error(error);
        throw error
    }

}


export const CookieSerializer = (listOfcookies: any, cookieOptions: bodyCookieOptions) => {
    listOfcookies.forEach((cookieElem: cookiesZerializerForEachProps) => {
        document.cookie = cookie.serialize(cookieElem.name, cookieElem.value, cookieOptions)
    })
}



export const ConvertDateToHourFormat = (creationDateOfMessage: Date) => {
    // const dateOfCreation = new Date(creationDateOfMessage) 
    const hour = creationDateOfMessage.getHours()
    const minutes = creationDateOfMessage.getMinutes()
    const formattedHour = hour % 12 || 12;

    const CreationHourOfMessage = `at ${formattedHour}:${minutes < 10 ? `0${minutes}` : minutes}${hour >= 12 ? ' PM' : ' AM'}`

    return CreationHourOfMessage
}

export const ConvertDateToDayFormat = (creationDateOfMessage: Date) => {
    // const dateOfCreation = new Date(creationDateOfMessage) 
    const actualDate = new Date()

    const creationday = creationDateOfMessage.getDay()
    const creationMonth = creationDateOfMessage.getMonth()
    const creationYear = creationDateOfMessage.getFullYear()
    const currentDay = actualDate.getDay()
    const currentMonth = actualDate.getMonth()
    const currentYear = actualDate.getFullYear()

    let CreationDayOfMessage

    if (creationday === currentDay && creationMonth === currentMonth && creationYear === currentYear) {
        CreationDayOfMessage = 'today'
    }
    else if (creationday === currentDay - 1 && creationMonth === currentMonth && creationYear === currentYear) {
        CreationDayOfMessage = 'yesterday'
    } else {
        CreationDayOfMessage = creationDateOfMessage.toLocaleString('default', { weekday: 'long' })
    }

    return CreationDayOfMessage
}

export const GetCurrentDateString = () => {
    const date = new Date();

    // Obtenemos los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Creamos la cadena con el formato deseado
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return dateString
}


export const TransformDateToCorrectFormatString = (dateToTransform: any) => {
    const date = new Date(dateToTransform);

    // Obtenemos los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Creamos la cadena con el formato deseado
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return dateString
}



export const TransformDateToEmitionDate = (dateToTransform: any) => {
    const date = new Date(dateToTransform);
    const currentDate = new Date()

    if (currentDate.getFullYear() === date.getFullYear() &&
        currentDate.getMonth() === date.getMonth() &&
        currentDate.getDay() === date.getDay()) {

        return 'today'

    }

    // Obtenemos los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    // Creamos la cadena con el formato deseado
    const dateString = `${day} / ${month} / ${year}`;

    return dateString
}


export const GetUserData = async () => {

    try {
        const resp = await GetUserDataValidated()
        return resp
        //   dispatch(updateUserAuth(true))
        //   dispatch(setUserData(useData))

    } catch (error) {
        console.log(error)
        throw error
    }
}

export const ValidateIfUserExistsInGroup = async (groupId: string, userIdToSearch: string) => {
    try {
        // aqui obtenemos siempre la cantidad de miembros restante que hay en el grupo, y si no quedan mas integrantes en el grupo este sera eliminado con todos los mensajes del grupo permanentemente
        const membersInGroup = await ValidateMembersOfGroup(groupId)
        // console.log(membersInGroup)
        // console.log(membersInGroup.length)

        if (membersInGroup.length === 0) return false

        const userExistsInTheGroup = membersInGroup.some((member: any) => member.user.user_id === userIdToSearch)

        // console.log(userExistsInTheGroup)

        return userExistsInTheGroup

    } catch (error) {
        console.log(error)
        throw error
    }
}



export const LimitYear = async (event: any) => {

    const inputValue = event.target.value;
    const keyCode = event.keyCode;
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    // Aqui Permitimos las teclas de control como Enter, Flecha Izquierda, Flecha Derecha
    if (event.ctrlKey || keyCode === 13 || keyCode === 37 || keyCode === 39) {
        return;
    }

    // Aqui Permitimos solo números y el carácter "-"
    if (!/^\d+$/.test(event.key) && event.key !== '-') {
        event.preventDefault();

    }

    // Aqui adquirimos el año del event.target.value 
    const year = inputValue.substring(0, 4);


    // Aqui Limitamos el año a 2024
    if (year > currentYear && year.length === 4) {
        event.preventDefault();

        const currentMonth = inputValue.substring(5, 7);
        const currentDay = inputValue.substring(8, 10);

        // console.log(currentMonth)
        // console.log(currentDay)

        const currentDate = `${currentYear}-${currentMonth}-${currentDay}`

        // console.log(currentDate)
        event.target.value = currentDate
        // console.log(event.target.value)

    }
}


export const ShowPassword = (newState: any, currentState: any) => {
    if (currentState === 'password') {
        newState('text')
        return
    } {
        newState('password')
        return
    }
}


export const GenerateMessageObjectToBackend = (messageId: string, userData: bodyUserData, groupData: groupData, message: string, creationDateOfMessageForBackend: string, isMessageRead: boolean, readTimestamp: string, messageType: string, chatType: string): bodyMessageToBacked => {

    const messageObjectToBackend = chatType === GROUP_CHAT ? {
        message_id: messageId,
        chat_id: userData.chat_id,
        group_id: groupData.group_id,
        user_id: userData.user_id,
        message_content: message,
        timestamp: creationDateOfMessageForBackend, //aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        is_read: isMessageRead,
        read_timestamp: readTimestamp, ////aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        message_type: messageType,
        username: userData.username,
        profile_picture: userData.profile_picture,
        chat_type: chatType, // group
        is_current_user_messsage: false
    } : {
        message_id: messageId,
        chat_id: userData.chat_id,
        user_id: userData.user_id,
        message_content: message,
        timestamp: creationDateOfMessageForBackend, //aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        is_read: isMessageRead,
        read_timestamp: readTimestamp, ////aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        message_type: messageType,
        username: userData.username,
        profile_picture: userData.profile_picture,
        chat_type: chatType, // contact
        is_current_user_messsage: false
    }


    return messageObjectToBackend

}


export const GenerateMessageObjectToNotification = (contactData: contactBody, messageId: string, userData: bodyUserData, type: string, chatType: string, message: string, member?: memberBody | any): bodyMessageToNotification => {

    const messageObjectToBackend = chatType === GROUP_CHAT ?
        {
            socketId: member.user.socket_id,
            messageId: messageId,
            userId: member.user.user_id,
            chatId: userData.chat_id,
            creatorProfilePicture: userData.profile_picture,
            creatorUserId: userData.user_id,
            creatorUserName: userData.username,
            groupId: member.group_id,
            type: type, // 'text'
            chatType: chatType, //'group'
            message: message,
            status: 'unread'
        } : {
            socketId: contactData.contact_user.socket_id,
            messageId: messageId,
            userId: contactData.contact_user.user_id,
            chatId: userData.chat_id,
            creatorProfilePicture: userData.profile_picture,
            creatorUserId: userData.user_id,
            creatorUserName: userData.username,
            type: type, // 'text'
            chatType: chatType, //'contact'
            message: message,
            status: 'unread',
            wasUserDeletedByHisContact: contactData.contact_user.was_User_Deleted_By_His_Contact
        }

    return messageObjectToBackend

}



export const GenerateMessageObjectToView = (messageId: string, userData: bodyUserData, creationDateOfMessage: Date | number, creationDayOfMessage: string, creationHourOfMessage: string, message: string, messageType: string, isMessageRead: boolean): bodyMessageToShowInView => {

    const messageObjectToView = {
        message_id: messageId,
        chat_id: userData.chat_id,
        user_id: userData.user_id,
        username: userData.username,
        timestamp: creationDateOfMessage,
        date: creationDayOfMessage,
        hour: creationHourOfMessage,
        message_content: message,
        profile_picture: userData.profile_picture,
        message_type: messageType, //'text'
        is_read: isMessageRead,
        is_current_user_messsage: true
    }


    return messageObjectToView

}



export const UpdateGroupList = async (dispatch: AppDispatch) => {

    // aqui estamos obteniendo la nuevas lista de grupos y la actualizamos en la vista 
    const groupsObtained = await GetAllGroupChats()

    dispatch(updateGroupChatList(groupsObtained))

}

export const UpdateContactList = async (dispatch: AppDispatch) => {

    // aqui estamos obteniendo la nuevas lista de contactos y la actualizamos en la vista 
    const contactsObtained = await GetAllContacts()

    dispatch(updatecontactsList(contactsObtained))


}


export const FilterUserAndContactsFromContactSearchList = (userData: bodyUserData, contactsList: contactBody[], usersObtained: bodyUserData[]): bodyUserData[] => {

    // aqui adaptando la data de el usuario para que se compatible con los demas objetos que estan en el array usersToSkip y que vienen de contactsList 
    const userDataToSkip = {
        contact_user: userData,
    }

    //aqui creamos un array con todos los contactos con los que ya cuenta este usuario, asi cuando se haga la busqueda no le aparesca usuario que ya tiene como contacto, ni tampoco su propia cuentra, algo asi como una blacklist  
    const usersToSkip = [...contactsList, userDataToSkip]

    // aqui filtramos todos los usuario que nos tenga el mismo nombre que usuario actual del array usersToSkip, para evitar que el usuario pueda seleccionar como nuevo contacto a su propia cuenta o le otros cuentas que ya tiene como contactos

    const listOfUsersFiltered: bodyUserData[] = []

    usersObtained.forEach((userObtained) => {

        const userFounded = usersToSkip.find((user) => user.contact_user.username === userObtained.username)

        if (userFounded) {
            return
        }

        listOfUsersFiltered.push(userObtained)

    })

    return listOfUsersFiltered

}



export const GetListOfMembersWithUpdatedStatuses = (membersListObtained: memberBody[], allParticipantsObtained: chatParticipantBody[]) => {
    // aqui estamos mapeando y filtrando los datos para que se nos devuelva un nuevo array que tenga el estado y el socketid incluido en la data de cada miembro  
    const membersList = membersListObtained.map((member) => {
        const participantFound = allParticipantsObtained.filter((participant) => member.user.user_id === participant.user_id)

        if (participantFound) {
            return {
                ...member,
                status: participantFound[0].status
            }
        }
    })

    return membersList
}


export const GetContactDetailsFromContactList = (contactsList: contactBody[], chatId: string) => {
    // aqui estamos obteniendo la data del chat de contacto seleccionado
    const contactDataFiltered = contactsList.filter((elem) => elem.chat_id === chatId)

    return contactDataFiltered[0]

}


export const ObtainContactListWithUpdatedNotificationNumber = (contactsList: contactBody[], notificationsObtained: notificationBody[]) => {

    const contactListModificated = contactsList.map((contactData) => {

        const notificationFound = notificationsObtained.filter((notification) => notification.chat_id === contactData.chat_id)

        // console.log(notificationFound)

        if (notificationFound) {
            const notificonsNumber = notificationFound.length

            return {
                ...contactData,
                notifications_number: notificonsNumber
            }
        }


        return {
            ...contactData,
            notifications_number: 0
        }


    })

    const contactListOrdered = contactListModificated.sort((a, b) => b.notifications_number - a.notifications_number)

    return contactListOrdered

}

export const ObtainGroupListWithUpdatedNotificationNumber = (groupList: groupBody[], notificationsObtained: notificationBody[]) => {

    const groupListModificated = groupList.map((groupData) => {

        const notificationFound = notificationsObtained.filter((notification) => notification.chat_id === groupData.group.chat_id)

        // console.log(notificationFound)

        if (notificationFound) {

            const notificonsNumber = notificationFound.length

            return {
                ...groupData,
                notifications_number: notificonsNumber
            }
        }


        return {
            ...groupData,
            notifications_number: 0
        }


    })

    // console.log(userNotificiationsList)
    // console.log(groupListModificated)


    const groupListOrdered = groupListModificated.sort((a, b) => b.notifications_number - a.notifications_number)

    return groupListOrdered

}


export const ValidateIfTheUserIsAnAdministrator = (groupData: groupData, userData: bodyUserData) => {

    const thisUserIsAdmin = groupData.members.find((member) => member.user.user_id === userData.user_id)

    return thisUserIsAdmin
}

export const ValidateIfTheMemberIsAnAdministrator = (groupData: groupData, memberId: string) => {

    const memberFound = groupData.members.find((member) => member.user.user_id === memberId)

    return memberFound
}

export const GetMemberListWithoutRecentlyRemovedMember = (groupData: groupData, memberId: string) => {

    const memberListUpdated = groupData.members.filter((member) => member.user.user_id !== memberId)


    const newGroupData = {
        ...groupData,
        members: memberListUpdated
    }

    return newGroupData
}

export const GetListOfMembersWithUpdatedMemberRole = (groupData: groupData, userIdToChangeRoleOfMember: string) => {
    const memberListUpdated = groupData.members.map((member) => {

        if (member.user.user_id === userIdToChangeRoleOfMember) {

            return { ...member, role: 'admin' }

        }

        return member
    })

    const newGroupData = {
        ...groupData,
        members: memberListUpdated
    }

    return newGroupData

}

export const ConvertBackendMessageBodyToViewableMessages = (oldMessagesObtained: messagesBodyFromBackend[], userData: bodyUserData) => {

    const messagesModified = oldMessagesObtained.map((message: messagesBodyFromBackend, index: number): bodyMessageToShowInView => {
        //  aqui pasamos el timestamp recibido de cada mensaje a funciones que convierten la hora y fecha de creacion del mensaje de timestamp a string 

        const timestampToDate = new Date(message.timestamp)


        const creationHourOfMessage = ConvertDateToHourFormat(timestampToDate)
        // console.log(creationHourOfMessage)

        const creationDayOfMessage = ConvertDateToDayFormat(timestampToDate)
        // console.log(creationDayOfMessage)

        const theMessageIsFromTheCurrentUser = message.user_id === userData.user_id ? true : false


        return {
            message_id: message.message_id,
            chat_id: message.chat_id,
            user_id: message.user_id,
            username: message.user_data.username,
            date: creationDayOfMessage,
            hour: creationHourOfMessage,
            message_content: message.message_content,
            profile_picture: message.user_data.profile_picture,
            message_type: message.message_type,
            timestamp: timestampToDate.getTime(),
            is_current_user_messsage: theMessageIsFromTheCurrentUser,
            is_read: message.is_read
        }


    })

    return messagesModified

}


export const GetListOfMessagesWithIssueDate = (allMessages: (bodyMessageToShowInView | chatParticipantBody)[],) => {


    const arrayOfMessagesToReturn: ChatMessages = []
    const arrayOfMemberJoined: (bodyMessageToShowInView | chatParticipantBody)[] = []

    // console.log(allMessages)

    // aqui estamos integrando dentro del array de messages la fecha de emicion de cada bloque de mensajes  

    allMessages.forEach((message, index: number) => {

        // console.log(allMessages)
        // console.log(message)


        // aqui esta la fecha del mensaje actual y del mensaje anterior para hacer la comparacion 
        const beforeIndex = index === 0 ? index : index - 1

        // ******aqui filtramos todos los mensajes con los siguiente condicionales****** 

        // esto se ejecuta si el elemento actual es de tipo unionDate
        if (message.message_type === "unionDate") {
            // console.log('se encontro que el elemento actual es de tipo unionDate')
            arrayOfMemberJoined.push(message)
            return
        }

        // esto se ejecuta al inicio de la iteracion del bucle en el primer elemento en el indice 0
        if (index === 0) {
            arrayOfMessagesToReturn.push(message)
            return
        }

        // esto se ejecuta si el elemenento anterior no es de tipo texto
        if (allMessages[beforeIndex].message_type !== 'text' || message.message_type !== 'text') {
            // console.log('se encontro que el elemento anterior no es de tipo texto')
            arrayOfMessagesToReturn.push(message)
            return
        }


        // console.log(beforeIndex)

        const currentTimestampValue = message.timestamp


        // console.log(allMessages[beforeIndex].timestamp)
        const beforeTimestampToDate = new Date(allMessages[beforeIndex].timestamp)
        // console.log(beforeTimestampToDate)


        // aqui convertimos el timestamp de la variable currentTimestampValue a un objeto date
        const currentTimestampToDate = new Date(currentTimestampValue)
        // console.log(currentTimestampToDate)


        // aqui estamos validando que la fecha de dia del mensaje anterior sea diferente al de el actual, para saber si la fecha actual ya no es la misma que la de lo mensajes anteriores 
        const isMessageHasDiferentDate = beforeTimestampToDate.getDay() !== currentTimestampToDate.getDay()

        // console.log(currentTimestampValue)

        // aqui transformamos la fecha seleccionada a string, para indicar la fecha desde la que se emitieron este grupo de mensajes
        const emitionDate = TransformDateToEmitionDate(currentTimestampValue)

        // console.log(emitionDate)

        // aqui estamos agregando el objeto de fecha de emision de mensajes a la lista de mnsajes para que el usuario puede ver desde que fecha se emitieron los mensajes siempre que el valor de isMessageHasDiferentDate se true 
        if (isMessageHasDiferentDate && emitionDate) {


            const dateOfEmitionNextMessages: messageIssueDateBody = {
                emition_id: uuidv4(),
                emition_date: emitionDate,
                message_type: 'emitionDate'
            }

            // console.log(dateOfEmitionNextMessages)

            arrayOfMessagesToReturn.push(dateOfEmitionNextMessages)

            // console.log('se aplico una fecha de emition de mensajes')
        }

        // aqui agregamos el mensaje que se comparo su timestamp con el otro mensaje anterior y resulto que las fechas son diferente para que se cree la fecha de emicion de un grupo de mensajes diferente antes de agregar el mensaje actual 
        arrayOfMessagesToReturn.push(message)

        return
    })

    const dataToReturn: ChatMessages = [...arrayOfMemberJoined, ...arrayOfMessagesToReturn]

    return dataToReturn
}


export const GetListOfOldMessagesWithIssueDate = (allMessages: ChatMessages) => {

    const arrayOfMessagesToReturn: ChatMessages = []
    const arrayOfMemberJoined: ChatMessages = []

    // console.log(allMessages)

    // aqui estamos integrando dentro del array de messages la fecha de emicion de cada bloque de mensajes  

    allMessages.forEach((message, index: number) => {
        if ('timestamp' in message && allMessages) {
            // console.log(allMessages)
            // console.log(message)


            // aqui esta la fecha del mensaje actual y del mensaje anterior para hacer la comparacion 
            const beforeIndex = index === 0 ? index : index - 1

            // ******aqui filtramos todos los mensajes con los siguiente condicionales****** 

            // esto se ejecuta si el elemento actual es de tipo unionDate
            if (message.message_type === "unionDate") {
                // console.log('se encontro que el elemento actual es de tipo unionDate')
                arrayOfMemberJoined.push(message)
                return
            }

            // esto se ejecuta al inicio de la iteracion del bucle en el primer elemento en el indice 0
            if (index === 0) {
                arrayOfMessagesToReturn.push(message)
                return
            }

            // esto se ejecuta si el elemenento anterior no es de tipo texto
            if (allMessages[beforeIndex].message_type !== 'text' || message.message_type !== 'text') {
                // console.log('se encontro que el elemento anterior no es de tipo texto')
                arrayOfMessagesToReturn.push(message)
                return
            }


            // console.log(beforeIndex)

            const currentTimestampValue = message.timestamp


            let beforeTimestampToDate: Date | number = new Date()
            if ('timestamp' in allMessages[beforeIndex]) {
                const beforeMessage = allMessages[beforeIndex] as bodyMessageToShowInView | chatParticipantBody

                // console.log(allMessages[beforeIndex].timestamp)
                beforeTimestampToDate = new Date(beforeMessage.timestamp)
                // console.log(beforeTimestampToDate)
            }

            // aqui convertimos el timestamp de la variable currentTimestampValue a un objeto date
            const currentTimestampToDate = new Date(currentTimestampValue)
            // console.log(currentTimestampToDate)


            // aqui estamos validando que la fecha de dia del mensaje anterior sea diferente al de el actual, para saber si la fecha actual ya no es la misma que la de lo mensajes anteriores 
            const isMessageHasDiferentDate = beforeTimestampToDate.getDay() !== currentTimestampToDate.getDay()

            // console.log(currentTimestampValue)

            // aqui transformamos la fecha seleccionada a string, para indicar la fecha desde la que se emitieron este grupo de mensajes
            const emitionDate = TransformDateToEmitionDate(currentTimestampValue)

            // console.log(emitionDate)

            // aqui estamos agregando el objeto de fecha de emision de mensajes a la lista de mnsajes para que el usuario puede ver desde que fecha se emitieron los mensajes siempre que el valor de isMessageHasDiferentDate se true 
            if (isMessageHasDiferentDate && emitionDate) {


                const dateOfEmitionNextMessages: messageIssueDateBody = {
                    emition_id: uuidv4(),
                    emition_date: emitionDate,
                    message_type: 'emitionDate'
                }

                // console.log(dateOfEmitionNextMessages)

                arrayOfMessagesToReturn.push(dateOfEmitionNextMessages)

                // console.log('se aplico una fecha de emition de mensajes')
            }

            // aqui agregamos el mensaje que se comparo su timestamp con el otro mensaje anterior y resulto que las fechas son diferente para que se cree la fecha de emicion de un grupo de mensajes diferente antes de agregar el mensaje actual 
            arrayOfMessagesToReturn.push(message)

            return

        }
    })

    const dataToReturn: ChatMessages = [...arrayOfMemberJoined, ...arrayOfMessagesToReturn]

    return dataToReturn

}


export const AddNotificationsToGroupList = (groupsObtained: groupBody[], notificationsObtained: notificationBody[],) => {

    // aqui agregamos el numero de notificaciones a la lista de grupos
    const groupListModificated = groupsObtained.map((groupData) => {

        const notifications = notificationsObtained.filter((notification) => (notification.chat_id === groupData.group.chat_id))


        const notificonsNumber = notifications.length

        // console.log(notifications)

        return {
            ...groupData,
            notifications_number: notificonsNumber
        }

    })

    // aqui ordenamos las lista de grupos por cual grupo de la lista tiene mas notificiones
    const groupListOrdered = groupListModificated.sort((a, b) => b.notifications_number - a.notifications_number)

    return groupListOrdered

}

export const AddNotificationsToContactList = (contactsObtained: contactBody[], notificationsObtained: notificationBody[]) => {


    // aqui agregamos el numero de notificaciones a la lista de contactos
    const contactListModificated = contactsObtained.map((contactData) => {

        const notifications = notificationsObtained.filter((notification) => notification.chat_id === contactData.chat_id)

        const notificonsNumber = notifications.length

        // console.log(notifications)

        return {
            ...contactData,
            notifications_number: notificonsNumber
        }

    })

    // aqui ordenamos las lista de contactos por cual chat de contacto de la lista tiene mas notificiones
    const contactsListOrdered = contactListModificated.sort((a, b) => b.notifications_number - a.notifications_number)

    return contactsListOrdered

}


export const AddStatusToTheDataOfEachGroupMember = (membersListObtained: memberBody[], allParticipantsObtained: chatParticipantBody[]) => {

    if(!membersListObtained) return

    // aqui estamos mapeando los datos para obtener un nuevo array con el nuevo miembro del grupo y con los status de los miembros actualizado, mas el del nuevo miembro que parecera siempre en inactive  
    const membersList = membersListObtained.map((member) => {
        const participantFound = allParticipantsObtained.filter((participant) => member.user.user_id === participant.user_id)

        if (participantFound) {
            return {
                ...member,
                status: participantFound[0].status
            }
        }
    })

    return membersList

}


export const UpdatePromotedMemberRoleToAdmin = (groupData: groupData, memberId: string) => {

    // aqui actualizamos el role del miembro que fue ascendido a admin
    const memberListUpdated = groupData.members.map((member) => {

        if (member.user.user_id === memberId) {

            return { ...member, role: 'admin' }

        }

        return member
    })

    return memberListUpdated
}


export const LogOutUser = () => {

    try {

        //Obtenemos la cadena de cookies convertida a un objeto js antes de hacer expirar todas las cookies
        const cookiesObject = cookie.parse(document.cookie)

        //Obtenemos la cadena de cookies y establecemos la fecha de todas las cookies como ya expirada para que se eliminen del navegador
        
        document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim()
            
            //se actualiza todas las cookies con fecha ya expirada 
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

            //se actualiza solo el cookie access_token con fecha ya expirada 
            // document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        })

        //Eliminamos la propiedad de nombre token en el objeto cookiesObject
        delete cookiesObject.access_token
        delete cookiesObject.refresh_token

        //Se establece una nueva fecha de expiracion para todas las cookies al momento de actualizar el objeto document.cookie con el los cookies obtenidos en el objeto cookiesObject anteriormente
        const cookiEexpirationDate = new Date()
        cookiEexpirationDate.setDate(cookiEexpirationDate.getDate() + 1)

        //Se establece una nueva path o ruta en la que fue creada la cookie, para todas las cookies
        const cookiePath = '/'


        //Atributos de cookies
        const cookieAttributes = {
            secure: false,
            httpOnly: false,
            path: cookiePath,
            expires: cookiEexpirationDate
        }

        //Se genera la cadena de cookies con la que vamos actualizar el objeto document.cookie 
        const updateCookiesObject = Object.keys(cookiesObject)
            .map((name) => cookie.serialize(name, cookiesObject[name], cookieAttributes)).join('; ')

        //Actualizamos el Objeto document.cookie con la nueva cadena de cookies 
        document.cookie = updateCookiesObject;
       
        return

    } catch (error) {
        console.log(error)
        throw error
    }

}


export const LogicToLimitAmountOfToastOnScreen = (toasts: Toast[], TOAST_LIMIT: number, toast: any) => {
    toasts
            .filter(t => t.visible) // Only consider visible toasts
            .filter((item, i) => i === TOAST_LIMIT) // Is toast index over limit
            .forEach(t => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
} 

