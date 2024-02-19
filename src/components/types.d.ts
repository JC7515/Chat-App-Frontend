import { type } from "os"
import { Message } from "postcss"
import React from "react"


// ******* SECCION DE INTERFACES Y TIPOS PARA SOCKET.IO ******

// interface ServerToClientEvents {
//     noArg: () => void;
//     basicEmit: (a: number, b: string, c: Buffer) => void;
//     withAck: (d: string, callback: (e: number) => void) => void;
//   }

//   interface ClientToServerEvents {
//     hello: () => void;
//   }


// ******* SECCION DE INTERFACES Y TIPOS PARA COOKIES ******   
export interface bodyCookieOptions {
    secure: boolean,
    httpOnly: boolean,
    path: string,
    expires: Date
}


export type cookiesZerializerForEachProps = {
    name: string,
    value: string
}

export interface cookiesZerializerProps {
    listOfcookies: [cookiesZerializerForEachProps],
    cookieOptions: bodyCookieOptions
}





// ********** SECCION DE INTERFACES Y TIPOS PARA COMPONENTE PROFILE ********

export interface propsToProfile {
    ProfileEditOnHandler: () => void,
    userData: bodyUserData,
    WasSendEditFormFunc: () => void
}



// ********** SECCION DE COMPONENTE CHATSCONTENT********






export type bodyUserData = {
    user_id: string,
    username: string,
    name: string,
    biography: string,
    phone: string,
    email: string,
    profile_picture: string,
    create_at: Date | string,
    chat_id: string,
    chat_type: string,
}

// 
export type ProfileEditOnHandlerType = Pick<props, "ProfileEditOnHandler">

// este es un objeto de ejemplo que estoy creando para simular la obtencion de los valores de las keys del objeto de forma automatica que vi utilizando el codigo type TODO_FILTERS[keyof typeof TODO_FILTERSTODO_FILTERS], en el video del profe midudev, el link del video es este si lo quieres repasar, el codigo se ve en el minuto: 1:00:00, y el link es este :https://www.youtube.com/watch?v=4lAYfsq-2TE 
export const LIST_BUTOMS = {
    PROFILE: 'Profile',
    CHAT: 'Chat',
    TASK: 'Task'
} as const // cuando le agregas as const a esta constante objeto haces que las propiedades del objeto sean solo de lectura y no modificables en otra parte del codigo que no sea en este archivo, es un hack que enseño el profe midu

//lo que estamos haciendo con este codigo typeof LIST_BUTOMS[keyof typeof LIST_BUTOMS], es poder extraer los valores de todas las propiedades del objeto LIST_BUTOMS de forma utomatica, evitando ponerlo de esta forma "Profile" | "Chat" | "Task", que hace que cuando queramos agregar mas propiedades al objeto en cuestion tengamos que tambien agregale a mano otro valor mas a este grupo de types "Profile" | "Chat" | "Task", este truco nos lo enseño el profe midu y es para objetener ese valores de la propiedades del objeto de forma automatica, y si agregamos mas propiedades al objeto, este codigo typeof LIST_BUTOMS[keyof typeof LIST_BUTOMS] actualizara y agregara automaticamente todas la propiedades recien agregadas.
export type listButtomsValues = typeof LIST_BUTOMS[keyof typeof LIST_BUTOMS]


// ********** SECCION DE INTERFACES Y TIPOS PARA COMPONENTE MESSAGE ********

export interface propsToMessageComponent {
    message: bodyMessage,
}


export interface bodyMessageToBacked {
    message_id: string,
    chat_id?: string,
    group_id?: string,
    user_id: string,
    message_content: string,
    timestamp?: string,
    is_read: boolean,
    read_timestamp?: string,
    message_type: string,
    username?: string
    profile_picture?: string,
    chat_type?: string,
    is_read?: boolean,
    is_current_user_messsage?: boolean,
}


export interface bodyMessageToNotification {
    socketId: string | undefined,
    messageId: string,
    userId: string,
    chatId: string,
    creatorProfilePicture: string,
    creatorUserId: string,
    creatorUserName: string,
    groupId?: string | undefined,
    type: string,
    chatType: string,
    message: string,
    status: string
}


// esta interface nos servira para los mensajes que se recueran depues de que el usaurio suba al area de mensajes antiguos y cuando el usuario envie un mensjaes
export interface bodyMessageToShowInView {
    message_id: string,
    chat_id: string,
    user_id: string,
    username: string,
    date: string,
    hour: string,
    message_content: string,
    profile_picture: string,
    message_type: string,
    timestamp: number | Date,
    is_current_user_messsage?: boolean,
    is_read?: boolean
}

export interface messageBodyForGroupSocketEvent {
    message_id: string,
    chat_id: string,
    group_id: string,
    user_id: string,
    username: string,
    timestamp: string | Date | number,
    date: string,
    hour: string,
    message_content: string,
    message_type: string,
    profile_picture: string,
    chat_type: string
}


export interface messageBodyForContactSocketEvent {
    message_id: string,
    chat_id: string,
    user_id: string,
    username: string,
    timestamp: string | Date | number,
    date: string,
    hour: string,
    message_content: string,
    profile_picture: string,
    message_type: string,
    chat_type: string,
    is_current_user_messsage: boolean
}



export type bodyMessage = {
    chat_id: string,
    user_id: string,
    name: string,
    date: string,
    hour: string,
    message_content: string,
    profile_image: StaticImport,
    is_read: boolean,
    message_type: string,
}


export type bodyMessageFromBackendForChat = {
    message_id: string,
    chat_id: string,
    user_id: string,
    message_content: string,
    timestamp: string | Date,
    is_read: string,
    read_timestamp: string,
    message_type: string,
    user_data: {
        user_id: string,
        username: string,
        profile_picture: string
    }
}


export type chatParticipantBody = {
    user_id: string,
    status: string | undefined,
    username: string,
    union_date: number | Date | string,
    message_type?: string,
    timestamp: number | Date,
}

export type messageIssueDateBody = {
    emition_id: string,
    emition_date: Date | string,
    message_type: string,
}

export type notificationBodyInChatMessages = {
    notification_id: string,
    message_type: string
}

// ********** SECCION DE INTERFACES Y TIPOS PARA CHATSCONTENT ********


export type contactData = {
    user_id: string,
    socket_id: string | undefined,
    username: string,
    profile_picture: string | undefined,
    contact_icon: string | undefined,
    status?: string | undefined,
    contact_blocked_you?: boolean | undefined
}

export type contactBody = {
    contact_id: string,
    user_id?: string,
    contact_user: contactData,
    chat_id: string,
    is_blocked: boolean | undefined,
    is_contact_validated: boolean | undefined,
    creation_date: Date | string,
    notifications_number?: number
}


export type memberBody = {
    group_id: string,
    invitation_id: string,
    role: string,
    status?: string,
    user: {
        name: string,
        profile_picture: string,
        socket_id: string,
        user_id: string,
        username: string,
    }
}

export type groupData = {
    group_id: string,
    chat_id: string,
    group_name: string,
    description: string,
    group_picture: string,
    group_icon: string,
    invitation_id: string,
    group_password: string,
    members: memberBody[],
}


export type groupBody = {
    group: groupData,
    notifications_number: number,
    role?: string,
    user_id?: string,
}


export type chatBody = {
    chat_id: string,
    name: string,
    type: string,
    last_update: string | Date
}


export type notificationBody = {
    notification_id: string,
    message_id: string,
    user_id: string,
    chat_id: string,
    group_id: string,
    type: string,
    chat_type: string,
    message: string,
    status: string,
}

export type ErrorBodyOne = {
    error: {
        message?: string
    }
}
export type ErrorBodyTwo = {
    error: string
}

export type ErrorBody = (ErrorBodyOne | ErrorBodyTwo)



// ********** SECCION DE INTERFACES Y TIPOS PARA PROPS DE COMPONENETS ********

export type PropsForMenuChat = {
    menuOpen: boolean,
    isOpenAChat: boolean,
    OpenCardToSelectOptions: (e) => void,
    groupChatsList: groupBody[],
    CloseMenuOpenGroupChatHandler: (e) => void,
    contactsList: contactBody[],
    CloseMenuOpenContactChatHandler: (e) => void,
    lockImage: StaticImageData,
    OpenNavigationMenuHandler: (e) => void,
    navigationMenuOpen: boolean,
    infoForNavMenuChat: infoForNavMenuChatBody[]
}


export type PropsForGroupChat = {
    userData: bodyUserData,
    menuOpen: boolean,
    isOpenAChat: boolean,
    BackToMenuHandler: (e) => void,
    OpenLeaveToGroupCard: (e) => void,
    groupData: groupData,
    OpenCardOfChangeRoleOfMember: (e) => void,
    CopyInvitationId: (e) => void,
    inputOfInvitationId: React.RefObject<HTMLInputElement>,
    invitationId: string,
    isInvitationIdCopied: boolean,
    OpenNavigationMenuHandler: () => void,
    navigationMenuOpen: boolean,
}


export type PropsForChat = {
    MenuOpenHandler: () => void,
    userData: bodyUserData,
    groupData: groupData,
    contactData: contactBody,
    lockImage: StaticImageData,
    OpenSettingsOfContactChat: () => void,
    messagesContainer: React.RefObject<HTMLDivElement>,
    ValidateUserInRecentMessageArea: () => void,
    getOldMessagesArea: React.RefObject<HTMLDivElement>,
    logoForMessageArea: StaticImageData,
    BlockingForNotKnowingTheUser: () => void,
    AddThisContact: () => void,
    chatmessages: ChatMessages,
    numberOfUnreadMessages: number,
    recentMessagesArea: React.RefObject<HTMLDivElement>,
    isUserInRecentMessagesArea: boolean,
    numberOfUnreadMessagesForIcon: number,
    DownToRecentMessageAreaHandler: () => void,
    GroupMessageSendingHandle: (e) => void,
    ContactMessageSendingHandle: (e) => void,
    message: string,
    changeValueOfMessage: (e) => void,

}


export type PropsForCommandWindows = {
    isOpenCardToSelectOptions: boolean,
    isOpenChannelCreationCard: boolean,
    isOpenJoinCardToChat: boolean,
    isOpenAddContactCard: boolean,
    wasNewIvitationIdCreated: boolean,
    isOpenCardToLeaveToGroup: boolean,
    OpenCardToCreateChannel: () => void,
    OpenCardToJoinChannel: () => void,
    OpenCardToAddContact: () => void,
    CloseCardToSelectOptions: () => void,
    HandlerCreateNewChannel: (e) => void,
    formToCreateChannel: React.RefObject<HTMLFormElement>,
    CloseCardOfCreateChannel: () => void,
    CopyInvitationId: () => void,
    inputOfInvitationId: React.RefObject<HTMLInputElement>,
    invitationId: string,
    isInvitationIdCopied: boolean,
    CloseCardOfInvitationIdCreated: () => void,
    HandlerJoinToChannel: (e) => void,
    formToJoinChannel: React.RefObject<HTMLFormElement>,
    setInvitationId: React.Dispatch<React.SetStateAction<string>>,
    CloseCardOfJoinToChannel: () => void,
    RegisterNewContact: (e) => void,
    HandlerSearchNewContacts: (e) => void,
    formToCreateNewContact: React.RefObject<HTMLFormElement>,
    searchNewContactValue: string,
    listOfNewContactSearched: bodyUserData[]
    SelectUserForToBeNewContact: (e) => void,
    SearchContactsOnPreviousPage: () => void,
    offsetToSearchNewContacts: number,
    SearchContactsOnNextPage: () => void,
    userSelectedToBeNewContact: bodyUserData,
    DeleteContactSelected: () => void,
    CloseCardOfAddContact: () => void,
    LeaveTheGroup: () => void,
    CloseLeaveToGroupCard: () => void,
    isOpenCardToChangeRoleOfMember: boolean,
    isUserAdminToGroup: boolean,
    DeleteMemberOfChat: () => void,
    ConvertMemberToAdmin: () => void,
    CloseCardOfChangeRoleOfMember: () => void,
    isOpenSettingsOfContactChat: boolean,
    DeleteChatHistory: () => void,
    UnlockThisContact: () => void,
    BlockThisContact: () => void,
    DeleteThisContact: () => void,
    CloseSettingsOfContactChat: () => void,
}





export type infoForNavMenuChatBody = {
    id: string,
    name: string,
    icon: React.ReactElement,
    class: string,
    link: string,
    funtionLogOut?: () => void,
}



// ********** SECCION DE INTERFACES Y TIPOS PARA PROPS DE FUNCIONES DE CARPETA UTILS ********

export type messagesBodyFromBackend = {
    message_id: string,
    chat_id: string,
    user_id: string,
    message_content: string,
    timestamp: string,
    is_read: boolean,
    read_timestamp: Date | string,
    message_type: string,
    user_data: {
        user_id: string,
        username: string,
        profile_picture: string,
    }
}

export type validatedEmailUser = {
    email: string
}


export type CookiesBody = {
    name: string,
    value: string
}

export type obtainedChatParticipantsObjectBody = {
    chat_data: chatBody,
    chat_participants: chatParticipantBody[]

}


export type propBodyToCreateANewGroup = {
    name: string | FormDataEntryValue | null,
    description: string | FormDataEntryValue | null,
    admin_id: string | null,
    group_password: string | FormDataEntryValue | null,
}


export type propBodyToAddNewMemberToAGroup = {
    invitation_id: string | FormDataEntryValue | null,
    group_password: string | FormDataEntryValue | null,
}



export type createNewGroupResponseBody = {
    invitation_id: string
}

export type addNewMemberToGroupResponseBody = {
    group_id: string,
    chat_id: string
}


export type HandlerOfUserSocketIdUpdatedPayload = {
    status: string
}

export type listChatMessagesUnreaded = {
    message_index: number
}



// ********** SECCION DE INTERFACES Y TIPOS PARA PROPS DE FUNCIONES DE CHATCONTENT COMPONENT ********

export type FormEvent = React.FormEvent<HTMLFormElement>
export type InputEvent = | React.ChangeEvent<HTMLInputElement>
export type EventTypes = | React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLImageElement> | React.MouseEvent<HTMLParagraphElement> | React.MouseEvent<HTMLHeadingElement>


export type ChatMessages = (bodyMessageToShowInView | chatParticipantBody | messageIssueDateBody | notificacionBody)[]



// ********** SECCION DE INTERFACES Y TIPOS PARA PROPS DE FUNCIONES DE SOCKETIO ********


export type GroupMessageEventFuncProps = {
    message_id: string,
    chat_id: string,
    group_id: string,
    user_id: string,
    username: string,
    timestamp: number | Date,
    date: string,
    hour: string,
    message_content: string,
    message_type: string,
    profile_picture: string,
    chat_type: string
}

export type ContactMessageEventFuncProps = {
    message_id: string,
    chat_id: string,
    user_id: string,
    username: string,
    timestamp: number | Date | string,
    date: string,
    hour: string,
    message_content: string,
    profile_picture: string,
    message_type: string,
    chat_type: string,
    is_current_user_messsage: boolean
}

export type NewMemberGroupFuncProps = {
    group_id: string,
    chat_id: string,
    user_id: string
}

export type AParticipantIsJoinedToGroupChatProps = {
    chat_id: string
}

export type AParticipantIsUnjoinedToGroupChatProps = {
    chat_id: string
}

export type AParticipantIsJoinedToContactChatProps = {
    chat_id: string,
    contact_user_id: string
}

export type AParticipantIsUnjoinedToContactChatProps = {
    chat_id: string,
    contact_user_id: string
}

export type CurrentNotificationData = {
    message_id: string,
    participant_id: string,
    chat_id: string,
    creator_profile_picture: string,
    creator_user_id: string,
    creator_userName: string,
    group_id: string,
    chat_type: string,
    type: string,
    message: string,
    status: string,
}

export type GroupNotificationMessageRecivedProps = {
    groupId: string,
    userNotificiationsList: notificacionBodyInChatMessages[],
    currentNotificationData: CurrentNotificationData
}

export type ContactNotificationMessageRecivedProps = {
    userNotificiationsList: notificacionBodyInChatMessages[],
    currentNotificationData: CurrentNotificationData
}


export type AParticipantChagedToRoleChatProps = {
    member_id: string
}

export type AParticipantWasDeletedByAdminToChatProps = {
    chat_id: string,
    member_id: string
}

export type AParticipantLeftTheGroupToChatProps = {
    chat_id: string,
    member_id_Left: string
}

export type ContactBlockingForNotKnowingTheUserProps = {
    chat_id: string,
    contact_user_id: string
}


export type ContactUnlockUserProps = {
    chat_id: string,
    contact_user_id: string
}

export type ContactIsInTheRecentMesssagesAreaProps = {
    chat_id: string, 
    is_contact_in_recent_messages_area: boolean
}