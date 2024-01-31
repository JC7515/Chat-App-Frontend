import { type } from "os"
import { Message } from "postcss"
import React from "react"



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
    profile_picture: string | undefined,
    create_at: Date,
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
    is_read: Boolean,
    read_timestamp?: string,
    message_type: string,
    username?: string
    profile_picture?: string,
    chat_type?: string,
    is_read?: boolean,
    is_current_user_messsage?: boolean,
}


// esta interface nos servira para los mensajes que se recueran depues de que el usaurio suba al area de mensajes antiguos y cuando el usuario envie un mensjaes
export interface bodyMessageToShowInView {
    message_id: string,
    chat_id: string | undefined,
    user_id: string | undefined,
    username: string | undefined,
    date: string,
    hour: string,
    message_content: string,
    profile_picture: string | undefined,
    message_type: string,
    timestamp?: Date | number,
    is_current_user_messsage: boolean,
    is_read: boolean
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




// ********** SECCION DE INTERFACES Y TIPOS PARA CHATSCONTENT ********


export type contactData = {
    user_id: string | undefined,
    socket_id: string | undefined,
    username: string,
    profile_picture: string | undefined,
    contact_icon: string | undefined,
    status?: string | undefined,
    contact_blocked_you?: boolean | undefined
}

export type contactBody = {
    contact_id: string | undefined,
    user_id: string | undefined,
    contact_user: contactData,
    chat_id: string | undefined,
    is_blocked: boolean | undefined,
    is_contact_validated: boolean | undefined,
    creation_date: Date | string | undefined,
    notifications_number?: number | undefined
}


export type memberBody = {
    group_id: string,
    invitation_id: string,
    role: string,
    status: string,
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
    notifications_number?: number | undefined,
    role?: string,
    user_id?: string,
}



// ********** SECCION DE INTERFACES Y TIPOS PARA PROPS DE COMPONENETS ********

export type PropsForMenuChat = {
    menuOpen: boolean,
    isOpenAChat: boolean,
    userData: bodyUserData,
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
    chatmessages: bodyMessageToShowInView[],
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


export type infoForNavMenuChatBody = {
    id: string,
    name: string,
    icon: React.ReactElement,
    class: string,
    link: string,
    funtionLogOut?: () => void,
}