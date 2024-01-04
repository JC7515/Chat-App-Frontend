import { type } from "os"


export interface bodyCookieOptions {
    secure: boolean,
    httpOnly: boolean,
    path: string,  
    expires: Date 
}


export type cookiesZerializerForEachProps = {
    name:string, 
    value: string
}

export interface cookiesZerializerProps {
    listOfcookies: [cookiesZerializerForEachProps],
    cookieOptions: bodyCookieOptions 
}



export interface propsToProfile {
    ProfileEditOnHandler: () => void,
    userData: bodyUserData,
    WasSendEditFormFunc: () => void
}

export interface propsToMessageComponent {
    message: bodyMessage,
}

export type bodyUserData = {
    user_id: string,
    username: string,
    name: string,
    biography: string,
    phone: string,
    email: string,
    profile_picture: string,
    create_at: Date,
    chat_id?: string,
    chat_type?: string,
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
