'use client'


import Image from "next/image"
import Link from "next/link"
import { toast, useToasterStore } from "react-hot-toast"
import { useRef, useEffect, useState } from "react"
import { A_ADMIN_HAS_DELETED_YOU_CHAT_EVENT, A_PARTICIPANT_CHANGED_TO_ROLE_EVENT, A_PARTICIPANT_DELETED_BY_ADMIN_CHAT_EVENT, A_PARTICIPANT_JOINED_THE_CONTACT_CHAT_EVENT, A_PARTICIPANT_JOINED_THE_GROUP_CHAT_EVENT, A_PARTICIPANT_LEFT_THE_GROUP_CHAT_EVENT, A_PARTICIPANT_UNJOINED_TO_CONTACT_CHAT_EVENT, A_PARTICIPANT_UNJOINED_TO_GROUP_CHAT_EVENT, BLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, chatMessages, CONTACT_CHAT, CONTACT_MESSAGE_EVENT, CONTACT_NOTIFICATION_MESSAGE_EVENT, DELETION_EXECUTED_BY_USER_TO_CONTACT_EVENT, ErrorToast, GET_USER_SOCKET_ID_EVENT, GROUP_CHAT, GROUP_MESSAGE_EVENT, GROUP_NOTIFICATION_MESSAGE_EVENT, iconsForChatsPage, iconsPageLogo, infoForNavMenuChat, IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT, LoadingToast, LOG_OUT_FAILURE_ERROR_MESSAGE, NEW_GROUP_MEMBER_EVENT, NotificationToast, SuccessToast, UNLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, USER_IS_ONLINE_EVENT } from "./ChatsContent.data"
import io, { Socket } from "socket.io-client";
import { AParticipantChagedToRoleChatProps, AParticipantIsJoinedToContactChatProps, AParticipantIsJoinedToGroupChatProps, AParticipantIsUnjoinedToContactChatProps, AParticipantIsUnjoinedToGroupChatProps, AParticipantLeftTheGroupToChatProps, AParticipantWasDeletedByAdminToChatProps, bodyMessageToBacked, bodyMessageToShowInView, bodyUserData, ChatMessages, chatParticipantBody, ContactBlockingForNotKnowingTheUserProps, contactBody, ContactDeleteTheUserProps, ContactIsInTheRecentMesssagesAreaProps, ContactMessageEventFuncProps, ContactNotificationMessageRecivedProps, ContactUnlockUserProps, EventTypes, FormEvent, groupBody, GroupMessageEventFuncProps, GroupNotificationMessageRecivedProps, HandlerOfUserSocketIdUpdatedPayload, InputEvent, listChatMessagesUnreaded, memberBody, messageIssueDateBody, messagesBodyFromBackend, NewMemberGroupFuncProps, notificationBody, notificationBodyInChatMessages, obtainedChatParticipantsObjectBody, PropsForChat, PropsForCommandWindows, PropsForGroupChat, PropsForMenuChat } from "../types"
import Message from "./subComponents/message/Message"
import { v4 as uuidv4 } from 'uuid'
import { AddNotificationsToContactList, AddNotificationsToGroupList, AddStatusToTheDataOfEachGroupMember, ConvertBackendMessageBodyToViewableMessages, ConvertDateToDayFormat, ConvertDateToHourFormat, FilterUserAndContactsFromContactSearchList, GenerateMessageObjectToBackend, GenerateMessageObjectToNotification, GenerateMessageObjectToView, GetContactDetailsFromContactList, GetCookieValue, GetCurrentDateString, GetListOfMembersWithUpdatedMemberRole, GetListOfMembersWithUpdatedStatuses, GetListOfMessagesWithIssueDate, GetListOfOldMessagesWithIssueDate, GetMemberListWithoutRecentlyRemovedMember, LogicToLimitAmountOfToastOnScreen, LogOutUser, ObtainContactListWithUpdatedNotificationNumber, ObtainGroupListWithUpdatedNotificationNumber, TransformDateToCorrectFormatString, TransformDateToEmitionDate, UpdateContactList, UpdateGroupList, UpdatePromotedMemberRoleToAdmin, ValidateIfTheMemberIsAnAdministrator, ValidateIfTheUserIsAnAdministrator, ValidateIfUserExistsInGroup } from "@/helpers"
import { ACCESS_TOKEN_NAME } from "../forLogin/authCard/AuthCard.data"
import { useRouter } from "next/navigation"
import { AddANewMemberToAGroup, ChangeMemberToAdmin, CreateBlockContact, CreateNewContact, CreateNewContactChatNotification, CreateNewGroup, CreateNewGroupChatNotification, DeleteAllNotifications, DeleteContact, DeleteContactChatHistory, DeleteMemberOfGroup, GetAllChatParticipantsOfGroup, GetAllContacts, GetAllGroupChats, GetAllMembersOfGroup, GetAllMessagesFromAContactChat, GetAllMessagesFromAGroupChat, GetAllNotificationsOfUser, GetContactChatData, GetlistOfUserByUsername, GetUserDataValidated, PermanentlyDeleteGroup, UpdateMessageData, UpdateStatusOfChatParticipant, ValidateMembersOfGroup } from "@/utils"
import lockImage from '../../../public/lockImage.png'
import logoForMessageArea from '../../../public/logo-for-message-area.png'
import { GetUserData } from "@/helpers"
import MenuChat from "./subComponents/menusChats/menuChat/MenuChat"
import GroupMenuChat from "./subComponents/menusChats/groupMenuChat/GroupMenuChat"
import Chat from "./subComponents/chat/Chat"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updatecontactsList } from "@/redux/features/contactsListSlice"
import { updateGroupChatList } from "@/redux/features/groupChatsListSlice"
import Commandwindows from "./commandwindows/Commandwindows"
import { updateContactData } from "@/redux/features/contactData"
import { updateGroupData } from "@/redux/features/groupData"
import { updateUserData } from "@/redux/features/userDataSlice"
import { type } from "os"

// const socket = io(`${process.env.NEXT_PUBLIC_API_URL_FOR_SOCKET}`, { autoConnect: false, path:`${process.env.PATH_SOCKET_IO}` })

const socket = io(`${process.env.NEXT_PUBLIC_API_URL_FOR_SOCKET}`, { autoConnect: false})


const ChatsContent = () => {

    const userDataBody: bodyUserData = {
        user_id: '',
        username: '',
        name: '...',
        biography: '...',
        phone: '...',
        email: '...',
        profile_picture: '',
        create_at: new Date(),
        chat_id: '',
        chat_type: ''
    }

    const userFound: any = {
        user_id: '',
        username: '',
        name: '...',
        biography: '...',
        phone: '...',
        email: '...',
        profile_picture: '/',
        create_at: new Date(),
        chat_id: '',
        chat_type: ''
    }

    const { toasts } = useToasterStore()


    const formToJoinChannel = useRef<HTMLFormElement>(null);
    const formToCreateChannel = useRef<HTMLFormElement>(null);
    const formToCreateNewContact = useRef<HTMLFormElement>(null);
    const messagesContainer = useRef<HTMLDivElement>(null);
    const recentMessagesArea = useRef<HTMLDivElement>(null)
    const getOldMessagesArea = useRef<HTMLDivElement>(null);
    const inputOfInvitationId = useRef<HTMLInputElement>(null);



    const [menuNavBarOpen, setMenuNavBarOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(true)
    const [navigationMenuOpen, setNavigationMenuOpen] = useState(false)
    const [isOpenAChat, setIsOpenAChat] = useState(false)
    const [isOpenChannelCreationCard, setIsOpenChannelCreationCard] = useState(false)
    const [isOpenJoinCardToChat, setIsOpenJoinCardToChat] = useState(false)
    const [isOpenAddContactCard, setIsOpenAddContactCard] = useState(false)
    const [isOpenCardToSelectOptions, setIsOpenCardToSelectOptions] = useState(false)

    const [isOpenCardToChangeRoleOfMember, setIsOpenCardToChangeRoleOfMember] = useState<boolean>(false)

    const [isOpenCardToLeaveToGroup, setIsOpenCardToLeaveToGroup] = useState<boolean>(false)


    const [isOpenSettingsOfContactChat, seIsOpenSettingsOfContactChat] = useState<boolean>(false)

    const [userIdToChangeRoleOfMember, setUserIdToChangeRoleOfMember] = useState<string>('')



    const [numberOfMembers, setNumberOfMembers] = useState(0)
    const [listOfNewContactSearched, setListOfNewContactSearched] = useState<bodyUserData[]>([userFound])
    const [searchNewContactValue, setSearchNewContactValue] = useState<string>('')

    const [userSelectedToBeNewContact, setUserSelectedToBeNewContact] = useState(userFound)



    // messages states
    const router = useRouter()

    const messagesBody = {
        message_id: '',
        chat_id: '',
        user_id: '',
        message_content: '',
        timestamp: '',
        is_read: '',
        read_timestamp: '',
        message_type: '',
        username: ''
    }

    const [chatmessages, setChatMessages] = useState<ChatMessages>([])
    const [message, setMessage] = useState('')

    // const [userData, setUserData] = useState<bodyUserData>(userDataBody)
    const [invitationId, setInvitationId] = useState<string>('')
    const [isInvitationIdCopied, setIsInvitationIdCopied] = useState<boolean>(false)


    const [wasNewIvitationIdCreated, setWasNewIvitationIdCreated] = useState(false)


    // Section of notifications and intersections
    const [thereUnreadMessages, setThereUnreadMessages] = useState(false)

    const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0)

    const [numberOfUnreadMessagesForIcon, setNumberOfUnreadMessagesForIcon] = useState(0)


    const [isUserInRecentMessagesArea, setIsUserInRecentMessagesArea] = useState(true);

    const [isContactInRecentMessagesArea, setIsContactInRecentMessagesArea] = useState(false);

    const [isUserInGetOldMessagesArea, setIsUserInGetOldMessagesArea] = useState(false);

    const [recentMessagesAreaEventWasEmittedToTrue, setRecentMessagesAreaEventWasEmittedToTrue] = useState(false);

    const [recentMessagesAreaEventWasEmittedToFalse, setRecentMessagesAreaEventWasEmittedToFalse] = useState(false);


    const [isGetOldMessagesAreaActive, setIsGetOldMessagesAreaActive] = useState(false);


    const [isUserSocketIDUpdated, setIsUserSocketIDUpdated] = useState(false);

    const [isUserAdminToGroup, setIsUserAdminToGroup] = useState<boolean>(false);

    const [offsetToSearchNewContacts, setOffsetToSearchNewContacts] = useState<number>(0);
    const [limitOfNewContactsPerPage, setLimitOfNewContactsPerPage] = useState<number>(20);


    const [lastParticipantEliminatedFromTheGroup, setLastParticipantEliminatedFromTheGroup] = useState<boolean>(false);




    // chats list 
    const groupBody: groupBody = {
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
        },
        notifications_number: 0,
        role: '',
        user_id: '',
    }


    const contactBody = {
        contact_id: '',
        user_id: '',
        contact_user: {
            user_id: undefined,
            socket_id: undefined,
            username: '',
            profile_picture: undefined,
            contact_icon: undefined,
            status: undefined,
            contact_blocked_you: undefined
        },
        chat_id: '',
        is_blocked: undefined,
        is_contact_validated: true,
        creation_date: undefined,
        notifications_number: undefined,
    }


    // const [contactsList, dispatch] = useState<contactBody[]>([])
    // const [groupChatsList, dispatch] = useState([groupBody])

    const [groupsListQuery, setGroupsListQuery] = useState<any>('')
    const [contactsListQuery, setContactsListQuery] = useState<any>('')


    // const [groupData, setGroupData] = useState<any>(groupBody.group)
    // const [contactData, setContactData] = useState<contactBody>(contactBody)


    const [isUserInNewChat, setIsUserInNewChat] = useState<any>(false)

    const [loaderWaitingTime, setloaderWaitingTime] = useState<any>(false)


    const contactsList = useAppSelector(state => state.contactsListSlice.data)
    const groupData = useAppSelector(state => state.groupDataSlice.data)

    const contactData = useAppSelector(state => state.contactDataSlice.data)
    const groupChatsList = useAppSelector(state => state.groupChatsListSlice.data)

    const userData: bodyUserData = useAppSelector(state => state.userDataSlice.data)


    const dispatch = useAppDispatch()



    const changeValueOfMessage = (e: any) => {
        e.preventDefault()

        setMessage(e.target.value)
    }





    // chat login funcions

    const GroupMessageSendingHandle = (e: FormEvent): void => {
        e.preventDefault()

        if (!message) return

        const creationDateOfMessageForBackend = GetCurrentDateString()
        const creationDateOfMessage = new Date()


        const dateZero = new Date(0)

        const dateZeroForReadTimestamp = TransformDateToCorrectFormatString(dateZero)


        //variables que almacenan el dia y hora de creacion del mensaje para mostrarlo directamente en la vista  
        const creationHourOfMessage = ConvertDateToHourFormat(creationDateOfMessage)

        const creationDayOfMessage = ConvertDateToDayFormat(creationDateOfMessage)

        const messageType = 'text'

        const messageId = uuidv4()


        const isMessageRead = isContactInRecentMessagesArea ? true : false

        // aqui si el mensajes es leido al momento por el contacto se otorgara la fecha actual para el campo read_timestamp, pero si no se otorgara una fecha zero, para hacer referencia a fechas anteriores a la actual
        const readTimestamp = isMessageRead ? creationDateOfMessageForBackend : dateZeroForReadTimestamp



        // esta es la estructura que se va a mandar al componente para ser guardada en la db
        const messageObjectToBackend = GenerateMessageObjectToBackend(messageId, userData, groupData, message, creationDateOfMessageForBackend, isMessageRead, readTimestamp, messageType, 'group')

        // const messageObjectToBackend: bodyMessageToBacked = {
        //     message_id: messageId,
        //     chat_id: userData.chat_id,
        //     group_id: groupData.group_id,
        //     user_id: userData.user_id,
        //     message_content: message,
        //     timestamp: creationDateOfMessageForBackend, //aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        //     is_read: isMessageRead,
        //     read_timestamp: readTimestamp, ////aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        //     message_type: messageType,
        //     username: userData.username,
        //     profile_picture: userData.profile_picture,
        //     chat_type: 'group',
        //     is_current_user_messsage: false
        // }

        // aqui comprobamos que la propiedad de chat_type tenga el dato group o contact, y si no lo tiene salimos del flujo para no ejecutar los eventos sockets que envia el mensaje al backend y ejecuta la logica restante
        if (!userData.chat_type) return


        // aqui que emitimos el evento de el mensaje
        socket.emit(GROUP_MESSAGE_EVENT, messageObjectToBackend)

        groupData.members.forEach((member: any) => {


            // aqui emitimos la notificacion para todos los usuario del grupo, ya que en la funcion NotificationMessageRecived se estara haciendo el filtrado de los uaurios, si se muestran las notificaciones con un toast o solo aparecen como un signo de mensajes no leidos  
            if (member.status === 'inactive') {
                // const notificationData = {
                //     socketId: member.user.socket_id,
                //     messageId: messageId,
                //     userId: member.user.user_id,
                //     chatId: userData.chat_id,
                //     creatorProfilePicture: userData.profile_picture,
                //     creatorUserId: userData.user_id,
                //     creatorUserName: userData.username,
                //     groupId: member.group_id,
                //     type: 'text',
                //     chatType: 'group',
                //     message: message,
                //     status: 'unread'
                // }

                const notificationData = GenerateMessageObjectToNotification(contactData, messageId, userData, 'text', 'group', message, member)

                socket.emit(GROUP_NOTIFICATION_MESSAGE_EVENT, notificationData)
            }

        })


        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
        }


        // este object es la estrutura que acepta el componente y que debe ir en el array de mensajes de chat para la vista
        // const messageObjectToView: bodyMessageToShowInView = {
        //     message_id: messageId,
        //     chat_id: userData.chat_id,
        //     user_id: userData.user_id,
        //     username: userData.username,
        //     timestamp: creationDateOfMessage,
        //     date: creationDayOfMessage,
        //     hour: creationHourOfMessage,
        //     message_content: message,
        //     profile_picture: userData.profile_picture,
        //     message_type: 'text',
        //     is_current_user_messsage: true,
        //     is_read: isMessageRead,
        // }


        const messageObjectToView = GenerateMessageObjectToView(messageId, userData, creationDateOfMessage, creationDayOfMessage, creationHourOfMessage, message, 'text', isMessageRead)


        setChatMessages([...chatmessages, messageObjectToView])
        setMessage('')


    }


    const ContactMessageSendingHandle = (e: FormEvent) => {
        e.preventDefault()

        if (!message) return

        const creationDateOfMessageForBackend = GetCurrentDateString()
        const creationDateOfMessage = new Date()


        const dateZero = new Date(0)

        const dateZeroForReadTimestamp = TransformDateToCorrectFormatString(dateZero)


        //variables que almacenan el dia y hora de creacion del mensaje para mostrarlo directamente en la vista  
        const creationHourOfMessage = ConvertDateToHourFormat(creationDateOfMessage)

        const creationDayOfMessage = ConvertDateToDayFormat(creationDateOfMessage)

        const messageType = 'text'


        const messageId = uuidv4()


        const isMessageRead = isContactInRecentMessagesArea ? true : false

        // aqui si el mensajes es leido al momentos por el contacto se otorgora la fechat actual para el campo read_timestamp, pero si no se otorgara una fecha zero
        const readTimestamp = isMessageRead ? creationDateOfMessageForBackend : dateZeroForReadTimestamp

        // esta es la estructura que se va a mandar al componente para ser guardada en la db

        const messageObjectToBackend = GenerateMessageObjectToBackend(messageId, userData, groupData, message, creationDateOfMessageForBackend, isMessageRead, readTimestamp, messageType, 'contact')


        // const messageObjectToBackend: bodyMessageToBacked = {
        //     message_id: messageId,
        //     chat_id: userData.chat_id,
        //     user_id: userData.user_id,
        //     message_content: message,
        //     timestamp: creationDateOfMessageForBackend, //aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        //     is_read: isMessageRead,
        //     read_timestamp: readTimestamp, ////aqui necesitamos crea una funcion para que nos envie el time stamp con minutos segundo y milisegundo
        //     message_type: messageType,
        //     username: userData.username,
        //     profile_picture: userData.profile_picture,
        //     chat_type: 'contact',
        //     is_current_user_messsage: false
        // }

        // aqui comprobamos que la propiedad de chat_type tenga el dato group o contact, y si no lo tiene salimos del flujo para no ejecutar los eventos sockets
        if (!userData.chat_type) return


        // aqui que emitimos el evento de el mensaje
        socket.emit(CONTACT_MESSAGE_EVENT, messageObjectToBackend)



        // aqui emitimos la notificacion para el contacto del usuario actual, ya que en la funcion NotificationMessageRecived se estara haciendo el filtrado de los usurios, si se muestran las notificaciones con un toast o solo aparecen como un signo de mensajes no leidos y solo se estaran enviando si el usuario no ah bloqueado al contacto o el contacto al usuario  
        if (contactData.contact_user.status === 'inactive' && !contactData.is_blocked && !contactData.contact_user.contact_blocked_you) {
            // const notificationData = {
            //     socketId: contactData.contact_user.socket_id,
            //     messageId: messageId,
            //     userId: contactData.contact_user.user_id,
            //     chatId: userData.chat_id,
            //     creatorProfilePicture: userData.profile_picture,
            //     creatorUserId: userData.user_id,
            //     creatorUserName: userData.username,
            //     type: 'text',
            //     chatType: 'contact',
            //     message: message,
            //     status: 'unread'
            // }

            const notificationData = GenerateMessageObjectToNotification(contactData, messageId, userData, 'text', 'contact', message)

            socket.emit(CONTACT_NOTIFICATION_MESSAGE_EVENT, notificationData)

        }


        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
        }



        // este object es la estrutura que acepta el componente y que debe ir en el arr de chat
        // const messageObjectToView: bodyMessageToShowInView = {
        //     message_id: messageId,
        //     chat_id: userData.chat_id,
        //     user_id: userData.user_id,
        //     username: userData.username,
        //     timestamp: creationDateOfMessage,
        //     date: creationDayOfMessage,
        //     hour: creationHourOfMessage,
        //     message_content: message,
        //     profile_picture: userData.profile_picture,
        //     message_type: 'text',
        //     is_read: isMessageRead,
        //     is_current_user_messsage: true
        // }

        const messageObjectToView = GenerateMessageObjectToView(messageId, userData, creationDateOfMessage, creationDayOfMessage, creationHourOfMessage, message, 'text', isMessageRead)

        setChatMessages([...chatmessages, messageObjectToView])
        setMessage('')

        // console.log(contactData)

    }


    const HandlerCreateNewChannel = async (e: FormEvent) => {

        try {
            e.preventDefault()

            if (!formToCreateChannel.current) return

            const formData = new FormData(formToCreateChannel.current)

            const payload = {
                name: formData.get('channelName'),
                description: formData.get('channelDescription'),
                admin_id: userData.user_id,
                group_password: formData.get('channelPassword'),
            }

            // aqui validamos que el usuario ponga obligatoriamente un nombre y descripcion para el nuevo grupo
            if (!payload.name) throw { error: 'name field is required' }

            if (!payload.description) throw { error: 'description field is required' }


            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Creating Group', "top-center")

            //aqui creamos un nuevo grupo en la base de datos 
            const newGroupCreated = await CreateNewGroup(payload)

            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))


            toast.dismiss(loadingToast)

            // aqui una vez acabado el proceso anterior se procede a ocultar la card de creacion de grupo invitacion de la vista
            setIsOpenChannelCreationCard(false)


            // aqui procedemos a mostrar la card de id de invitacion en la vista 
            setInvitationId(newGroupCreated.invitation_id)
            setWasNewIvitationIdCreated(true)


            // aqui obtenemos el nuevo array de grupos incluido el que el usuario creo recientemente y lo mostramos en la vista
            await UpdateGroupList(dispatch)

            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('New Group Created', "top-center")


            formToCreateChannel.current.reset()

        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }

    }


    const HandlerJoinToChannel = async (e: FormEvent) => {
        try {
            e.preventDefault()

            if (!formToJoinChannel.current) return


            const formData = new FormData(formToJoinChannel.current)

            const payload = {
                invitation_id: formData.get('invitationId'),
                group_password: formData.get('channelPassword'),
            }

            if (!payload.invitation_id) throw { error: 'invitation id field is required' }


            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Joining To Group', "top-center")


            //aqui creamos un nuevo grupo en la base de datos 
            const newMemberAdded = await AddANewMemberToAGroup(payload)


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 500))


            toast.dismiss(loadingToast)



            // console.log('se integro nuevo usuario dentro del grupo, se procede a cerrar la card')
            // aqui una vez acabado el proceso anterior se procede a ocultar la card de union a grupo de la vista
            setIsOpenJoinCardToChat(false)



            // aqui procedemos a emitir un evento de tipo NEW_GROUP_MEMBER_EVENT para que ah todos los usuario que esten conectados a grupo en ese mismo momento les aparesca que el nuevo usuario se a unido al grupo
            const dataForEmit: any = {
                group_id: newMemberAdded.group_id,
                chat_id: newMemberAdded.chat_id,
                user_id: userData.user_id
            }

            socket.emit(NEW_GROUP_MEMBER_EVENT, dataForEmit)

            // console.log('se emition el evento NEW_GROUP_MEMBER_EVENT del socket')

            // aqui obtenemos el nuevo array de grupos incluido al que el usuario se unio recientemente y lo mostramos en la vista
            await UpdateGroupList(dispatch)


            // si todo salio bien la peticion nos deberia devolver un status OK sin ninguna data incluida
            // console.log(data.status) 

            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Joined To Group', "top-center")

            // aqui reseteamos los valores de todos lo inputs del formulario  
            formToJoinChannel.current.reset()

        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }
    }



    const HandlerDeleteMenber = () => {
        //  aqui funcionabilidad para eliminar a un miembro
    }



    const HandlerSearchNewContacts = async (e: InputEvent) => {
        try {
            const valueOfSearchBar = e.target.value

            setSearchNewContactValue(valueOfSearchBar)

            const offset = offsetToSearchNewContacts * limitOfNewContactsPerPage

            const usersObtained = await GetlistOfUserByUsername(valueOfSearchBar, offset, limitOfNewContactsPerPage)

            // // aqui adaptando la data de el usuario para que se compatible con los demas objetos que estan en el array usersToSkip y que vienen de contactsList 
            // const userDataToSkip = {
            //     contact_user: userData,
            // }

            // //aqui creamos un array con todos los contactos con los que ya cuenta este usuario, asi cuando se haga la busqueda no le aparesca usuario que ya tiene como contacto, ni tampoco su propia cuentra, algo asi como una blacklist  
            // const usersToSkip = [...contactsList, userDataToSkip]

            // // aqui filtramos todos los usuario que nos tenga el mismo nombre que usuario actual del array usersToSkip, para evitar que el usuario pueda seleccionar como nuevo contacto a su propia cuenta o le otros cuentas que ya tiene como contactos

            // const listOfUsersFiltered: bodyUserData[] = []

            // usersObtained.forEach((userObtained) => {

            //     const userFounded = usersToSkip.find((user: any) => user.contact_user.username === userObtained.username)

            //     if (userFounded) {
            //         return
            //     }

            //     listOfUsersFiltered.push(userObtained)

            // })

            // aqui obtenemos la lista de contacto buscados, pero filtrados la cuenta del usuario y todos sus contactos ya agregados para evitar que puede agregarse a si mismo a sus contactos ya existentes
            const listOfUsersFiltered = FilterUserAndContactsFromContactSearchList(userData, contactsList, usersObtained)

            // console.log(listOfUsersFiltered)

            if (usersObtained.length > 0) {
                setListOfNewContactSearched(listOfUsersFiltered)
            } else {
                setListOfNewContactSearched([])
            }

        } catch (error) {
            console.log(error)
            // aqui podemos aplicar un toast en caso de que haya un error
        }
    }

    const SelectUserForToBeNewContact = (e: InputEvent) => {
        const userSelectedId = e.target.id
        // listOfNewContactSearched.filter((user) => user.user_id =  userSelectedId )
        const userObtained = listOfNewContactSearched.filter((user) => user.user_id === userSelectedId)

        // console.log(userObtained)
        if (userObtained) {
            setUserSelectedToBeNewContact(userObtained[0])
            setListOfNewContactSearched([])
            setSearchNewContactValue('')
        }

    }


    const RegisterNewContact = async (e: FormEvent) => {
        try {
            e.preventDefault()

            const contactUserId = userSelectedToBeNewContact.user_id

            // aqui estamos creando un nuevo contacto
            await CreateNewContact(contactUserId)

            // aqui estamos obteniendo la nuevas lista de contactos actualizados 
            await UpdateContactList(dispatch)

            CloseCardOfAddContact()

        } catch (error: any) {
            console.log(error)
            // aqui ejecutamos logica de toast en el caso de que ocurra un error 

        }

    }


    // #region 
    const OpenNavigationMenuHandler = () => {
        if (!navigationMenuOpen) {
            setNavigationMenuOpen(true)
        } else {
            setNavigationMenuOpen(false)
        }
    }

    const OpenCardToSelectOptions = () => {
        setIsOpenCardToSelectOptions(true)
    }

    const CloseCardToSelectOptions = () => {
        setIsOpenCardToSelectOptions(false)
    }

    const OpenCardToJoinChannel = () => {

        if (!formToJoinChannel.current) return

        // aqui reseteamos los valores de todos lo inputs del fomulario cada que salgamos de la card
        formToJoinChannel.current.reset()
        setInvitationId('')

        setIsOpenJoinCardToChat(true)
        setIsOpenCardToSelectOptions(false)

    }

    const OpenCardToCreateChannel = () => {
        // aqui lo que hacemos es resetear todos los valores de lo inputs y textarea que se encuentran dentro del formulario para crear un nuevo channel
        if (formToCreateChannel.current) {

            formToCreateChannel.current.reset()
            setIsOpenChannelCreationCard(true)
            setIsOpenCardToSelectOptions(false)
        }
    }

    const OpenCardToAddContact = () => {
        setIsOpenAddContactCard(true)
        setIsOpenCardToSelectOptions(false)
    }

    const OpenCardOfChangeRoleOfMember = (e: EventTypes) => {
        const memberSelected = e.currentTarget.id

        const isAdminSelectMemberToGroup = groupData.members.find((member) => member.user.user_id === memberSelected && member.role === 'member')

        if (isAdminSelectMemberToGroup) {
            setIsOpenCardToChangeRoleOfMember(true)
            setUserIdToChangeRoleOfMember(memberSelected)
        }
    }

    const OpenLeaveToGroupCard = () => {
        setIsOpenCardToLeaveToGroup(true)
    }


    const OpenSettingsOfContactChat = () => {
        seIsOpenSettingsOfContactChat(true)
    }

    const CloseSettingsOfContactChat = () => {
        seIsOpenSettingsOfContactChat(false)
    }


    const CloseCardOfCreateChannel = () => {
        setIsOpenChannelCreationCard(false)
    }

    const CloseCardOfJoinToChannel = () => {
        setIsOpenJoinCardToChat(false)
        setInvitationId('')
    }

    const CloseCardOfAddContact = () => {
        setIsOpenAddContactCard(false)
        setUserSelectedToBeNewContact('')
        setListOfNewContactSearched([])
        setSearchNewContactValue('')
    }

    const CloseCardOfInvitationIdCreated = () => {
        setWasNewIvitationIdCreated(false)
        setInvitationId('')
    }

    const CloseCardOfChangeRoleOfMember = () => {
        setIsOpenCardToChangeRoleOfMember(false)
        setUserIdToChangeRoleOfMember('')
    }

    const CloseLeaveToGroupCard = () => {
        setIsOpenCardToLeaveToGroup(false)
    }

    const SearchContactsOnNextPage = async () => {

        const newValue = offsetToSearchNewContacts + 1

        // setOffsetToSearchNewContacts((prevValue: any) => prevValue)

        const offset = newValue * limitOfNewContactsPerPage

        const usersObtained = await GetlistOfUserByUsername(searchNewContactValue, offset, limitOfNewContactsPerPage)

        // aqui obtenemos la lista de contacto buscados, pero filtrados la cuenta del usuario y todos sus contactos ya agregados para evitar que puede agregarse a si mismo a sus contactos ya existentes
        const listOfUsersFiltered = FilterUserAndContactsFromContactSearchList(userData, contactsList, usersObtained)

        // aqui estamos validando que en la siguiente pagina haya elementos, ya que si no las ahi, queremos que el usuario ya no puedo seguir pasando mas paginas, y solo se muestre la ultima pagina que tenia elemntos

        if (usersObtained.length > 0) {
            // aqui si la funcion GetlistOfUserByUsername devuelve un array con elemento mayor a 0 quiero que se refleje como una pagina nueva
            setListOfNewContactSearched(listOfUsersFiltered)
            setOffsetToSearchNewContacts(newValue)
        } else {
            // aqui si la funcion GetlistOfUserByUsername devuelve un array igual a cero o vacio, quiero que no se muestre este array y se muestre el array anterior
            setListOfNewContactSearched((prevList) => [...prevList])
            setOffsetToSearchNewContacts((prevValue) => prevValue)
        }
        // console.log(usersObtained)


    }

    const SearchContactsOnPreviousPage = async () => {

        if (offsetToSearchNewContacts === 0) return


        const newValue = offsetToSearchNewContacts - 1

        // setOffsetToSearchNewContacts((prevValue: any) => prevValue)

        const offset = newValue * limitOfNewContactsPerPage

        const usersObtained = await GetlistOfUserByUsername(searchNewContactValue, offset, limitOfNewContactsPerPage)

        // aqui obtenemos la lista de contacto buscados, pero filtrados la cuenta del usuario y todos sus contactos ya agregados para evitar que puede agregarse a si mismo a sus contactos ya existentes
        const listOfUsersFiltered = FilterUserAndContactsFromContactSearchList(userData, contactsList, usersObtained)

        setListOfNewContactSearched(listOfUsersFiltered)
        setOffsetToSearchNewContacts(newValue)


    }


    const DeleteContactSelected = () => {
        setUserSelectedToBeNewContact(userFound)
    }

    const MenuOpenHandler = () => {
        if (!menuOpen) {
            setMenuOpen(true)
        }
    }

    const MenuCloseHandler = () => {
        if (menuOpen || isOpenAChat) {
            setMenuOpen(false)
            setIsOpenAChat(false)
        }
    }

    const BackToMenuHandler = async () => {
        // setIsUserInRecentMessagesArea(false)
        setIsOpenAChat(false)
        setMenuOpen(true)
        setChatMessages([])
        setMessage('')



        const contactsListObtained = await
            GetAllContacts()

        dispatch(updatecontactsList(contactsListObtained))

        // aqui actualizamos las notificaciones de todos los grupos en los que es miembro el usuario
        const notificationsObtained = await GetAllNotificationsOfUser()

        // console.log(notificationsObtained)

        const groupsObtained = await GetAllGroupChats()



        // console.log(groupsObtained)
        // aqui estamos agregando el numero de notificaciones que tiene sin leer el usuario cada grupo  
        if (notificationsObtained) {
            const listOfGroupsWithNotificationsSorted = AddNotificationsToGroupList(groupsObtained, notificationsObtained)

            dispatch(updateGroupChatList(listOfGroupsWithNotificationsSorted))

        } else {
            dispatch(updateGroupChatList(groupsObtained))
        }

        // console.log(lastParticipantEliminatedFromTheGroup)


        // aqui validamos si el usuario sigue existiendo en el grupo como miembro, antes de actualizar su estado, esto para evitar errores en el caso de que el usurario se haya retiraso previmente del grupo 
        const userExistsInTheGroup = await ValidateIfUserExistsInGroup(groupData.group_id, userData.user_id)


        if (userExistsInTheGroup) {

            // aqui actulizamos el status de usuario como participante del chat que acaba de desconectarse
            const newStatusValue = "inactive"
            await UpdateStatusOfChatParticipant(groupData.chat_id, userData.user_id, newStatusValue)
        }

        // aqui emitimos un evento que le llegara a todos los demas miembros del grupo para que en su pantalla figura que el usuario se ah desconectado de el chat
        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        socket.emit(A_PARTICIPANT_UNJOINED_TO_GROUP_CHAT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: userData.chat_id })


        const chatIdValue = ''
        const chatType = ''
        //Aqui actualizamos las propiedades chat_type y chat_id del usuario despues de haber saltado a vacio, por que se dirije a menu 
        UpdatechatDataInUserData(chatIdValue, chatType)



        dispatch(updateGroupData(groupBody.group))


        // aqui actulizamos el estado de la variable setLastParticipantEliminatedFromTheGroup a false, para la proxima vez se puede ejecutar la logica de actualizacion a inactive del estado del particiapnte del group   
        setLastParticipantEliminatedFromTheGroup(false)
    }

    const MenuNavBarOpenHandler = () => {
        if (!menuNavBarOpen) {
            setMenuNavBarOpen(true)
        } else {
            setMenuNavBarOpen(false)
        }
    }

    const DownToRecentMessageAreaHandler = () => {

        if (!isUserInRecentMessagesArea && messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
            setNumberOfUnreadMessagesForIcon(0)
        }

    }


    //#endregion

    const UpdatechatDataInUserData = (chatIdValue: any, chatType: string) => {
        // 
        const newDataForUser = {
            ...userData,
            chat_id: chatIdValue,
            chat_type: chatType
        }


        // setUserData((prevData: any) => ({
        //     ...prevData,
        //     chat_id: chatIdValue,
        //     chat_type: chatType,
        // }))

        dispatch(updateUserData(newDataForUser))

        // console.log(userData)
    }


    const CloseMenuOpenGroupChatHandler = async (e: EventTypes) => {

        if ('id' in e.target) {


            if (!isOpenAChat && menuOpen || userData.chat_type === CONTACT_CHAT) {

                // console.log('Se ejecuto funcion CloseMenuOpenGroupChatHandler')


                // console.log('chat_type')
                // console.log(userData.chat_type)

                if (userData.chat_type === CONTACT_CHAT) {


                    const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

                    const newStatusValue = 'inactive'

                    // aqui estamos cambiando el status de esta usuario para su chat de contacto a inactivo, antes de cambiar al chat de grupo
                    await UpdateStatusOfChatParticipant(contactData.chat_id, userData.user_id, newStatusValue)

                    socket.emit(A_PARTICIPANT_UNJOINED_TO_CONTACT_CHAT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: userData.chat_id, contactSocketId: contactData.contact_user.socket_id })

                    dispatch(updateContactData(contactBody))

                }

                // aqui estamos actualizando el valor de IsUserInNewChat cada que el usuario cambie de chat y el movimiento de scroll inicial tenga que reiniciarse
                setIsUserInNewChat(true)


                // ***** Aqui cambiamos el valor de isUserInRecentMessagesArea para que cuando se cambie de chat el moviemiento de scroll hacia el area de mensajes mas recientes se realize, ya que si no punemos esto no se hara el movimiento completo ****
                setIsUserInRecentMessagesArea(true)


                // ***************************

                setIsOpenAChat(true)
                setMenuOpen(false)
                // UpdatechatDataInUserData('', '')

                /* *********** actualizamos datos de la variable groupData *************  */
                // Aqui logica para obetener el id del chat de grupo

                const EventTarget = e.target.id as string
                const groupId: string = EventTarget

                // console.log(groupId)
                const groupDataFiltered = groupChatsList.filter((elem) => elem.group.group_id === groupId)
                const groupDataSelected = groupDataFiltered[0].group

                setInvitationId(groupDataSelected.invitation_id)

                const newStatusValue = 'active'

                await UpdateStatusOfChatParticipant(groupDataSelected.chat_id, userData.user_id, newStatusValue)


                // aqui estamos obtenido todo los miembros del grupos para luego utilizarlo en el map 
                const membersListObtained = await GetAllMembersOfGroup(groupId)

                // aqui estamos obteniendo todo los participantes del chat para luego utilizarlo en el map
                const chatParticipants = await GetAllChatParticipantsOfGroup(groupDataSelected.chat_id)

                const allParticipantsObtained = chatParticipants.chat_participants


                // aqui obtenemos la lista de miembros con sus status actualizados
                const membersList = GetListOfMembersWithUpdatedStatuses(membersListObtained, allParticipantsObtained)

                const groupDataNewObject = {
                    ...groupDataSelected,
                    members: membersList
                }

                // console.log(groupDataNewObject.members)
                dispatch(updateGroupData(groupDataNewObject))


                /* *********** aqui actualizamos los valores de las propiedades de la variable UserData *************  */

                // aqui obtenemos el valor de chat_id del chat de grupo seleccionado para actualizar la propiedad chat_id del usuario y que asi se ejecute el useEffect que ejecutara la logica para obtener los mensajes de chat del grupo seleccionado  
                const chatIdValue = groupDataSelected.chat_id
                const chatType = GROUP_CHAT
                //Aqui actualizamos las propiedades chat_type y chat_id del usuario despues de haber saltado a otro chat 
                UpdatechatDataInUserData(chatIdValue, chatType)




                //aqui eliminamos todas la notificaciones del grupo que no leyo el usuario 
                await DeleteAllNotifications(groupDataSelected.chat_id)


            }
        }
    }


    // NOS QUEDAMOS HASTA ACA EN LA REFACTORIZACION

    const CloseMenuOpenContactChatHandler = async (e: EventTypes) => {

        // if (userData.chat_type === GROUP_CHAT || userData.chat_type === CONTACT_CHAT || userData.chat_type === '') {


        const chatIdOfContactChat = e.currentTarget.id


        if (userData.chat_id !== '' && chatIdOfContactChat !== contactData.chat_id && userData.chat_type === CONTACT_CHAT) {
            // console.log('se ejecuto la logica de pasar a inactivo el chat de contacto previo en CloseMenuOpenContactChatHandler ')

            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

            const newStatusValue = 'inactive'

            // aqui estamos cambiando el status de esta usuario para su chat de contacto a inactivo, antes de cambiar al chat de grupo
            await UpdateStatusOfChatParticipant(contactData.chat_id, userData.user_id, newStatusValue)

            socket.emit(A_PARTICIPANT_UNJOINED_TO_CONTACT_CHAT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: userData.chat_id, contactSocketId: contactData.contact_user.socket_id })

            setChatMessages([])

        }



        // aqui estamos actualizando el valor de IsUserInNewChat cada que el usuario cambie de chat y el movimiento de scroll inicial tenga que reiniciarse
        setIsUserInNewChat(true)


        // ***** Aqui cambiamos el valor de isUserInRecentMessagesArea para que cuando se cambie de chat el moviemiento de scroll hacia el area de mensajes mas recientes se realize, ya que si no punemos esto no se hara el movimiento completo ****
        setIsUserInRecentMessagesArea(true)


        // ***************************

        setIsOpenAChat(true)
        setMenuOpen(true)
        // UpdatechatDataInUserData('', '')


        /* *********** actualizamos datos de la variable contactData *************  */
        // Aqui logica para obetener el id del chat de grupo
        const chatId = e.currentTarget.id
        // console.log(chatId)

        // aqui estamos obteniendo la data del chat de contacto seleccionado
        const contactDataSelected = GetContactDetailsFromContactList(contactsList, chatId)

        // aqui obtenemos los datos mas recientes del chat de contacto contacto que esta seleccionando el usuario, esto para evitar obtener datos desactualizados y afectar la logica de la app 
        const contactDataObtained = await GetContactChatData(contactDataSelected.chat_id, contactDataSelected.contact_user.user_id)



        // console.log(contactDataSelected)

        const newStatusValue = 'active'

        MenuCloseHandler()

        // aqui estamos cambiando el status de este usuario que es intregrante del chat a activo, cuando ingresa al chat de contacto
        await UpdateStatusOfChatParticipant(contactDataSelected.chat_id, userData.user_id, newStatusValue)


        const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

        socket.emit(A_PARTICIPANT_JOINED_THE_CONTACT_CHAT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: userData.chat_id, contactSocketId: contactDataObtained.contact_user.socket_id })


        /* *********** aqui actualizamos los valores de las propiedades de la variable UserData *************  */

        // aqui obtenemos el valor de chat_id del chat de grupo seleccionado para actualizar la propiedad chat_id del usuario y que asi se ejecute el useEffect que ejecutara la logica para obtener los mensajes de chat del grupo seleccionado  
        const chatIdValue = contactDataSelected.chat_id
        const chatType = CONTACT_CHAT
        //Aqui actualizamos las propiedades chat_type y chat_id del usuario despues de haber saltado a otro chat 
        UpdatechatDataInUserData(chatIdValue, chatType)



        // console.log(contactDataSelected)
        dispatch(updateContactData(contactDataObtained))


        //aqui eliminamos todas la notificaciones del chat de contacto que no leyo el usuario 
        await DeleteAllNotifications(contactDataObtained.chat_id)


        // aqui emitimos un evento que no le permita al contacto saber cuando el usuario se encuentra en la area de mensajes reciente o no   
        socket.emit(IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT, { authToken: `Bearer ${accessToken}`, chatId: contactDataObtained.chat_id, is_user_in_recent_messages_area: true })


        // * *********** aqui obtenemos y actualizamos las notificacion de todos los contactos del usuario ********
        const notificationsObtained = await GetAllNotificationsOfUser()

        // aqui obtenemos la lista de contactos con el mumero de notificaciones actualizados
        const contactListUpdated = ObtainContactListWithUpdatedNotificationNumber(contactsList, notificationsObtained)

        dispatch(updatecontactsList(contactListUpdated))


        // }
    }


    const ValidateUserInRecentMessageArea = async () => {

        // Aqui utilizamos el observer para comprobar que el usuario no se encuentra en la zona de los ultimos mensajes del chat, si no en una zona mas arriba, por lo que tenemos que enviarle 
        const RecentMessagesIntersection = async (entries: IntersectionObserverEntry[]) => {
            const firstEntry = entries[0]

            setIsUserInRecentMessagesArea(firstEntry.isIntersecting)

        }

        const intersectionOptions = {
            threshold: 0.1,
            root: messagesContainer.current
        }

        const observerForRecentMessagesArea = new IntersectionObserver(RecentMessagesIntersection, intersectionOptions)

        if (observerForRecentMessagesArea && recentMessagesArea.current) {
            observerForRecentMessagesArea.observe(recentMessagesArea.current)
        }


        // console.log(numberOfUnreadMessagesForIcon)


        /* ********** aqui ejecutamos la logica del interception para obtener los mensajes antiguos ********* */

        const GetOldMessagesIntersection = async (entries: IntersectionObserverEntry[]) => {
            const firstEntry = entries[0]

            // console.log('se quiso obtener mensajes antiguos')
            setIsUserInGetOldMessagesArea(() => firstEntry.isIntersecting)

            // if (firstEntry.isIntersecting) {
                // console.log('se quiso obtener mensajes antiguos')
            // }

            // else {
            //     console.log('No se quiso obtener mensajes antiguos')
            // }


        }

        // Aqui utilizamos el observer para comprobar que el usuario no se encuentra en la zona de los ultimos mensajes del chat, si no en una zona mas arriba, por lo que tenemos que enviarle 

        // const OptionsForGetOldMessage = {
        //     threshold: 0.5,
        //     root: messagesContainer.current
        // }

        const ObserverForGetOldMessagesArea = new IntersectionObserver(GetOldMessagesIntersection, intersectionOptions)



        if (ObserverForGetOldMessagesArea && getOldMessagesArea.current && !isUserInRecentMessagesArea && isGetOldMessagesAreaActive) {
            ObserverForGetOldMessagesArea.observe(getOldMessagesArea.current)
        }



        return () => {
            if (observerForRecentMessagesArea && recentMessagesArea.current) {
                observerForRecentMessagesArea.disconnect()
            }
            if (ObserverForGetOldMessagesArea && getOldMessagesArea.current) {
                ObserverForGetOldMessagesArea.disconnect()
            }
        }


    }




    //#region 



    const DeleteMemberOfChat = async () => {
        try {
            // console.log(groupData)

            const memberIdToDelete = userIdToChangeRoleOfMember
            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('loading', "top-center")

            // aqui validamos que el miembro que este realizando esta accion sea un administrador 
            const thisUserIsAdmin = ValidateIfTheUserIsAnAdministrator(groupData, userData)

            if (thisUserIsAdmin?.role !== 'admin') {
                throw { error: { message: 'You cannot perform this action if you are not an administrator' } }
            }

            // aqui validamos que el administrador no este eliminando a otro administrado, ya que eso no se puede
            const memberFound = ValidateIfTheMemberIsAnAdministrator(groupData, memberIdToDelete)

            if (memberFound?.role === 'admin') {
                throw { error: { message: 'Cant remove group administrators' } }
            }

            // aqui se ejecuta la funcion de eliminar miembro del grupo 
            await DeleteMemberOfGroup(memberIdToDelete, groupData.group_id, groupData.chat_id)


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 500))


            toast.dismiss(loadingToast)


            // aqui emitimos un evento para que todos los miembros conectados al chat se les actualize la nueva lista de miembros del grupo, sin el miembro recientemente eliminado
            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

            const dataForEmit = { authToken: `Bearer ${accessToken}`, memberIdDeleted: memberIdToDelete, chatId: userData.chat_id }

            socket.emit(A_PARTICIPANT_DELETED_BY_ADMIN_CHAT_EVENT, dataForEmit)

            // aqui validamos retiramos al miembro recien eliminado de la lista del usuario en la vista
            const newGroupData = GetMemberListWithoutRecentlyRemovedMember(groupData, memberIdToDelete)

            dispatch(updateGroupData(newGroupData))
            setUserIdToChangeRoleOfMember('')
            setIsOpenCardToChangeRoleOfMember(false)


            // console.log(groupData.members)
            // aqui podemos poner una notificacion toast que indique que se realizo la eliminacion con exito

            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Member Deleted', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui ponemos la logica para mandar una notificacion del error por medio de un toast
            ErrorToast(error.error?.message || error.error, "top-center")
        }
    }

    const ConvertMemberToAdmin = async () => {
        try {

            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('loading', "top-center")

            // aqui validamos que el miembro que este realizando esta accion sea un administrador 
            const thisUserIsAdmin = ValidateIfTheUserIsAnAdministrator(groupData, userData)

            if (thisUserIsAdmin?.role !== 'admin') {
                throw { error: { message: 'You cannot perform this action if you are not an administrator' } }
            }

            // aqui validamos que el administrador no este volviendo administrador a otro administrado, ya que eso no se puede
            const memberFound = ValidateIfTheMemberIsAnAdministrator(groupData, userIdToChangeRoleOfMember)

            if (memberFound?.role === 'admin') {
                throw { error: { message: 'The member is already an administrator of the group' } }
            }


            // aqui se ejecuta la funcion de convetir miembro del grupo a administrador 
            await ChangeMemberToAdmin(userIdToChangeRoleOfMember, groupData.group_id)


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 500))


            toast.dismiss(loadingToast)


            // aqui emitimos un evento para que todos los miembros conectados al chat se les actualize el nuevo role que tiene el miembro ascendido a admin
            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

            const dataForEmit = { authToken: `Bearer ${accessToken}`, memberIdConvertedToAdmin: userIdToChangeRoleOfMember, chatId: groupData.chat_id }

            socket.emit(A_PARTICIPANT_CHANGED_TO_ROLE_EVENT, dataForEmit)



            // aqui actualizamos el role del miembro que fue ascendido a admin, para el administrador
            const newGroupData = GetListOfMembersWithUpdatedMemberRole(groupData, userIdToChangeRoleOfMember)

            dispatch(updateGroupData(newGroupData))

            setUserIdToChangeRoleOfMember('')
            setIsOpenCardToChangeRoleOfMember(false)

            // aqui podemos poner una notificacion toast que indique que se realizo el cambio de rol con exito

            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Member converted to admin', "top-center")

        } catch (error: any) {
            console.log(error)
            // aqui ponemos la logica para mandar una notificacion del error por medio de un toast 
            ErrorToast(error.error?.message || error.error, "top-center")
        }
    }


    const CopyInvitationId = () => {

        if (!inputOfInvitationId.current) return

        inputOfInvitationId.current.select()
        document.execCommand('copy')
        setIsInvitationIdCopied(true)

        setTimeout(() => setIsInvitationIdCopied(false), 4000)

    }


    const LeaveTheGroup = async () => {
        try {

            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Creating Group', "top-center")

            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))

            const groupId = groupData.group_id
            const chatId = groupData.chat_id

            toast.dismiss(loadingToast)

            if (!groupId) {
                // console.log('group not found')
                throw { error: { message: 'An unexpected error occurred, try again' } }
            }


            // aqui eliminamos al miembro del grupo que decidio salirse del grupo voluntariamente
            await DeleteMemberOfGroup(userData.user_id, groupId, chatId)


            // aqui emitimos un evento para que la lista de miembros del grupo se actulize sin el miembro que se retiro, cuando el usuario se retire del grupo voluntarimente
            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

            const dataForEmit = { authToken: `Bearer ${accessToken}`, userId: userData.user_id, chatId: userData.chat_id }

            socket.emit(A_PARTICIPANT_LEFT_THE_GROUP_CHAT_EVENT, dataForEmit)


            // aqui obtenemos de nuevo todos los grupos de los que el usuario forma parte sin el grupo recien eliminado, para luego actualizar la vista
            const userGroupsObtained = await GetAllGroupChats()

            dispatch(updateGroupChatList(userGroupsObtained))

            // aqui obtenemos siempre la cantidad de miembros restante que hay en el grupo, y si no quedan mas integrantes en el grupo este sera eliminado con todos los mensajes del grupo permanentemente
            const numberOfMembersInGroup = await ValidateMembersOfGroup(groupId)
            // console.log(numberOfMembersInGroup)

            if (numberOfMembersInGroup.length === 0) {

                // este funcion eleminara permanente el grupo que ya no tenga integrantes y todos los mensajes del grupo 
                await PermanentlyDeleteGroup(groupData.chat_id, groupId)

                // aqui cambiamos el valorde este state a true para que cuando se ejecute la  func BackToMenuHandler en la parte donde actualiza el estado del particiapante del chat a inactive, ahora ya no ejecute esa ligica si ya se elimino permanentemente el grupo 
                setLastParticipantEliminatedFromTheGroup((prevValue: boolean) => true)


            }

            CloseLeaveToGroupCard()
            BackToMenuHandler()

            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('you left the group successfully', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui ponemos la logica para mandar una notificacion del error por medio de un toast
            ErrorToast(error.error?.message || error.error, "top-center")
        }
    }



    const FilterGroupsList = async (e: any) => {

        const inputValue = e.target.value

        setGroupsListQuery(inputValue)

        if (inputValue === '') {
            const groupsListObtained = await GetAllGroupChats()
            dispatch(updateGroupChatList(groupsListObtained))
            return
        }


        const groupsFiltered = groupChatsList.filter((item: any) => item.group.group_name.indexOf(inputValue) === 0)

        dispatch(updateGroupChatList(groupsFiltered))

    }

    const FilterContactList = async (e: any) => {

        const inputValue = e.target.value

        setContactsListQuery(inputValue)

        if (inputValue === '') {
            const contactsListObtained = await GetAllContacts()
            dispatch(updatecontactsList(contactsListObtained))
            return
        }


        const contactsFiltered: any = contactsList.filter((item: any) => item.contact_user.username.indexOf(inputValue) === 0)

        dispatch(updatecontactsList(contactsFiltered))

    }


    const BlockThisContact = async () => {

        try {

            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Loading', "top-center")


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))


            //aqui estamos registrando un bloqueo activo del contacto que le escribio al usuario, para que este contacto no puede enviarle mas mensajes     

            const blockStatus = 'active'
            const blockDate = GetCurrentDateString()

            await CreateBlockContact(contactData.user_id, contactData.contact_user.user_id, blockStatus, contactData.chat_id, blockDate)


            // aqui estamos actualizando la data de chat de contacto y actualizando el valor de la proppiedad is_blocked a true, para que en la vista del chat se visualize al contacto como bloqueado al instante  
            const newContactChatData = await GetContactChatData(contactData.chat_id, contactData.contact_user.user_id)

            dispatch(updateContactData(newContactChatData))


            // aqui eliminamos el toast de loading
            toast.dismiss(loadingToast)


            // aqui emitimos un evento para que en el contacto, le aparesca que este usuario le ah bloqueado y este no pueda recibir mensajes de este usuario
            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

            socket.emit(BLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: contactData.chat_id })


            CloseSettingsOfContactChat()


            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Contact Blocked', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }

    }

    const BlockingForNotKnowingTheUser = async () => {

        try {

            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Loading', "top-center")


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))


            // **** UTILIDAD: Esta funcion se ejecuta cuando el usuario va a bloquear al contacto en la primera interaccion que tuvo con el, es decir cuando le aparece el mensaje de ¿Do you know this user? en el chats ***********

            // **** NOTA: primero creamos un block en inactive y luego otro block en active, para que en la tabla de blocks no se pierda el orden y no se afecte el filtro de los mensaje con los bloqueos del chat ********



            //aqui estamos registrando un bloqueo inaactivo del contacto que le escribio al usuario, para no romper el patron de orden de los bloqueos en tabla blocks 

            const blockStatusInactive = 'inactive'
            const blockDate = GetCurrentDateString()

            await CreateBlockContact(contactData.user_id, contactData.contact_user.user_id, blockStatusInactive, contactData.chat_id, blockDate)

            //aqui estamos registrando un bloqueo activo del contacto que le escribio al usuario, para que este contacto no puede enviarle mas mensajes     

            const blockStatusActive = 'active'

            await CreateBlockContact(contactData.user_id, contactData.contact_user.user_id, blockStatusActive, contactData.chat_id, blockDate)

            // // aqui estamos actualizando la data de chat de contacto y actualizando el valor de la proppiedad is_blocked a true, para que en la vista del chat se visualize al contacto como bloqueado al instante  
            // const contactDataUpdated = { ...contactData, is_blocked: true }

            const newContactChatData = await GetContactChatData(contactData.chat_id, contactData.contact_user.user_id)

            // console.log(newContactChatData)
            dispatch(updateContactData(newContactChatData))


            // aqui eliminamos el toast de loading
            toast.dismiss(loadingToast)


            // aqui emitimos un evento para que en el contacto, le aparesca que este usuario le ah bloqueado y este no pueda recibir mensajes de este usuario
            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

            socket.emit(BLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: contactData.chat_id })


            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Contact Blocked', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }

    }

    const AddThisContact = async () => {
        try {

            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Loading', "top-center")


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))


            // aqui hacemos que el mensajes de ¿do you know this user? con las opciones de bloquear y add this contact desaparesca y registrando un bloqueo de contacto inactivo que indica que el usuario valido al contacto y este puede enviarle mensajes cuando desee


            const blockStatus = 'inactive'

            const creationDateOfContact = contactData.creation_date

            await CreateBlockContact(contactData.user_id, contactData.contact_user.user_id, blockStatus, contactData.chat_id, creationDateOfContact)


            // aqui obtenemos los datos mas recientes del chat de contacto del usuario, para que no haya ningun error  
            const newContactChatData = await GetContactChatData(contactData.chat_id, contactData.contact_user.user_id)

            dispatch(updateContactData(newContactChatData))

            // aqui eliminamos el toast de loading
            toast.dismiss(loadingToast)


            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Contact Added', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }

    }


    const DeleteChatHistory = async () => {
        try {

            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Loading', "top-center")


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))


            await DeleteContactChatHistory(contactData.chat_id)

            // aqui eliminamos el toast de loading
            toast.dismiss(loadingToast)

            CloseSettingsOfContactChat()

            setChatMessages([])


            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Chat Deleted', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }

    }


    const DeleteThisContact = async () => {
        try {


            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Delete This Contact', "top-center")


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))


            // LOGICA EN CASO DE QUE UNO DE LOS DOS USUARIOS DEL CHAT DE CONTACTO NO SE HAYAN VALIDADO AUN, PERO UNO IGUAL DECIDA ELIMINARLO COMO CONTACTO, ESTO CON EL FIN DE EVITAR ERRORES 

            //  A)
            // aqui agregamos un block inactive en caso de que el usuario que va a elminar este contacto no haya validado aun al contacto, pero igual desea eleminarlo
            if (contactData.is_contact_validated && !contactData.contact_user.contact_has_validated_you) {


                const blockStatus = 'inactive'
                const blockDate = GetCurrentDateString()

                // *************************
                await CreateBlockContact(contactData.contact_user.user_id, contactData.user_id, blockStatus, contactData.chat_id, blockDate)

            }


            //  B)
            // aqui agregamos un block inactive en caso de que el usuario que va a elminar este contacto no lo hayan validado aun como contacto
            if (!contactData.is_contact_validated && contactData.contact_user.contact_has_validated_you) {

                const blockStatus = 'inactive'
                const blockDate = GetCurrentDateString()

                await CreateBlockContact(contactData.user_id, contactData.contact_user.user_id, blockStatus, contactData.chat_id, blockDate)

            }


            
            const newStatusValue = 'inactive'

            // aqui estamos cambiando el status de esta usuario para su chat de contacto a inactivo, antes de cambiar al chat de grupo
            await UpdateStatusOfChatParticipant(contactData.chat_id, userData.user_id, newStatusValue)

            // aqui eliminamos el contacto de usuario
            await DeleteContact(contactData.chat_id, contactData.contact_user.user_id)

           
            setIsContactInRecentMessagesArea(false)

            // aqui integramos una emicion de socket id, para que cada vez que se elimine un contacto se actualize la lista de contactos del usuario
            const contactsList = await GetAllContacts()

            toast.dismiss(loadingToast)

        
            // aqui emitimos un evento para que en el contacto, le aparesca que este usuario lo ah eliminado de su lista de contactos y este no lo pueda visualizar
            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


            socket.emit(A_PARTICIPANT_UNJOINED_TO_CONTACT_CHAT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: userData.chat_id, contactSocketId: contactData.contact_user.socket_id })

            socket.emit(IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT, { authToken: `Bearer ${accessToken}`, chatId: contactData.chat_id, is_user_in_recent_messages_area: false })

            socket.emit(DELETION_EXECUTED_BY_USER_TO_CONTACT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: contactData.chat_id, contact_user_socket_id: contactData.contact_user.socket_id })


            CloseSettingsOfContactChat()

            dispatch(updatecontactsList(contactsList))
            dispatch(updateContactData(contactBody))
            setChatMessages([])
            

            const chatIdValue = ''
            const chatType = ''

            //Aqui actualizamos las propiedades chat_type y chat_id del usuario despues de haber el contacto 
            UpdatechatDataInUserData(chatIdValue, chatType)


            // aqui indicamos que una vez se eleimine en contacto y su chat, la variable IsOpenAChat estara en falso y el meno abierto como por defecto cuando el usuario ingresa recien a la pagina, y esto para evitar que no haya problemas con abrir los chats de grupo si lo el usuario lo desea
            setIsOpenAChat(false)
            setMenuOpen(true)


            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Contact Deleted', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }



    }


    const UnlockThisContact = async () => {

        try {

            // aqui notificacion que indica al usuario que la accion se esta procesando
            const loadingToast = LoadingToast('Loading', "top-center")


            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))



            //aqui estamos registrando un bloqueo activo del contacto que le escribio al usuario, para que este contacto no puede enviarle mas mensajes     

            const blockStatus = 'inactive'
            const blockDate = GetCurrentDateString()

            await CreateBlockContact(contactData.user_id, contactData.contact_user.user_id, blockStatus, contactData.chat_id, blockDate)




            // aqui obtenemos los datos mas recientes del chat de contacto del usuario despues de desbloqueo de contacto, para que no haya ningun error  
            const newContactChatData = await GetContactChatData(contactData.chat_id, contactData.contact_user.user_id)

            // console.log(newContactChatData)
            dispatch(updateContactData(newContactChatData))


            toast.dismiss(loadingToast)


            // aqui emitimos un evento para que en el contacto, le aparesca que este usuario lo ah desbloqueado y este ya pueda recibir mensajes de este usuario y mandarle mensajes
            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)
            // console.log('Se emitio el evento de auth al inicio sin tener un chatid el user')


            socket.emit(BLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: contactData.chat_id })


            CloseSettingsOfContactChat()

            // aqui notificacion que indica al usuario que la accion se realizo con exito
            SuccessToast('Contact Unlocked', "top-center")


        } catch (error: any) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast en caso de error
            ErrorToast(error.error?.message || error.error, "top-center")
        }

    }

    const LogOutHandler = async () => {

        try {

            const loadingToast = LoadingToast('Loading', "top-center")

            // aqui retrasamos por un segundo la eliminacion del loading toast, para que no desaparesca tan rapido en la vista
            await new Promise((resolve) => setTimeout(() => { resolve('') }, 1000))


            LogOutUser()

            toast.dismiss(loadingToast)

            router.push('/')

        } catch (error: any) {
            // aqui agregaremos logica de notificaciones toast en caso de error y que no se logre hacer el logOut con exito
            ErrorToast(LOG_OUT_FAILURE_ERROR_MESSAGE, "top-center")

        }


    }




    useEffect(() => {
        // no-op if the socket is already connected
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);


    // HASTA AQUI ME EH QUEDADO

    useEffect(() => {

        const RunAllFunc = async () => {



            /* ********** aqui ejecutamos la logica del interception para obtener los Cuando el usuario se encuentre en el area de mensajes recientes ********* */

            if (isUserInRecentMessagesArea && numberOfUnreadMessagesForIcon > 0 && userData.chat_id) {

                // console.log('se ejecuto la eliminacion de notificaciones por el intersection observer de isUserInRecentMessagesArea')
                // console.log('se ejecuto la eliminacion de notificaciones por el intersection observer de isUserInRecentMessagesArea')
                // console.log(userData.chat_id)
                await DeleteAllNotifications(userData.chat_id)
                // console.log('DeleteAllNotifications')
                setNumberOfUnreadMessagesForIcon(0)
            }


            if (isUserInRecentMessagesArea && !recentMessagesAreaEventWasEmittedToTrue && userData.chat_id) {

                setRecentMessagesAreaEventWasEmittedToTrue(true)
                setRecentMessagesAreaEventWasEmittedToFalse(false)

                // aqui emitimos un evento que no le permita al contacto saber cuando el usuario se encuentra en la area de mensajes reciente o no   

                const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

                const chatIdValue = userData.chat_type === CONTACT_CHAT ? contactData.chat_id : groupData.chat_id

                socket.emit(IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT, { authToken: `Bearer ${accessToken}`, chatId: chatIdValue, is_user_in_recent_messages_area: true })

            }

            if (!isUserInRecentMessagesArea && !recentMessagesAreaEventWasEmittedToFalse && userData.chat_id) {

                setRecentMessagesAreaEventWasEmittedToFalse(true)
                setRecentMessagesAreaEventWasEmittedToTrue(false)

                // aqui emitimos un evento que no le permita al contacto saber cuando el usuario se encuentra en la area de mensajes reciente o no 

                const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

                const chatIdValue = userData.chat_type === CONTACT_CHAT ? contactData.chat_id : groupData.chat_id

                socket.emit(IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT, { authToken: `Bearer ${accessToken}`, chatId: chatIdValue, is_user_in_recent_messages_area: false })

            }




            /* ********** aqui ejecutamos la logica del interception para obtener los mensajes antiguos ********* */

            if (isUserInGetOldMessagesArea && isGetOldMessagesAreaActive && chatmessages.length > 0) {

                // Aqui estamos pasando a falso el valor de isUserInGetOldMessagesArea, para evitar que el se sigan obteniendo mas bloques de mensajes antiguos uno detras del otro sin que el usuario este tocando la iterseccion 
                setIsUserInGetOldMessagesArea(false)

                // aqui logica para eliminar la notificaciones de mensajes de la db, si el usuario llega a leer los mensajes no leidos en el momento

                const firstMessageInTheList = chatmessages.find((message) => {
                    if ('message_id' in message) {
                        return message.message_id
                    }
                })

                const messagesLimit = 20
                let creationDate: string = ''
                if (firstMessageInTheList && 'timestamp' in firstMessageInTheList) {
                    creationDate = TransformDateToCorrectFormatString(firstMessageInTheList.timestamp)
                }


                // aqui estamos validando el tipo de chat que eligio el usuario, para llamar extrear mensajes de grupo o de contact
                const oldMessagesObtained: messagesBodyFromBackend[] = (userData.chat_type === GROUP_CHAT) ?
                    await GetAllMessagesFromAGroupChat(userData.chat_id, messagesLimit, creationDate)
                    :
                    await GetAllMessagesFromAContactChat(userData.chat_id, messagesLimit, creationDate)


                // Aqui validamos que la lista de mensajes antiguos que se solicito, ya exista en el array actual de mensajes, para que se evite que el cliente vea una duplicacion de los mensajes antiguos del chat
                const listMessageAlreadyExist = oldMessagesObtained.find((message: messagesBodyFromBackend) => {
                    if (chatmessages[0] && 'message_id' in chatmessages[0]) {
                        return message.message_id === chatmessages[0].message_id
                    }
                })

                if (listMessageAlreadyExist) return

                // aqui adaptamos los datos de los mensajes antiguos, para que sean aptos para ser mostrados en la vista 
                const oldMessagesModified = ConvertBackendMessageBodyToViewableMessages(oldMessagesObtained, userData)


                const allMessagesForUpdate: ChatMessages = await new Promise((resolve) => {

                    // aqui juntamos la lista de mensajes antiguos y con la lista actual de mensajes. 
                    const allMessages = [...oldMessagesModified, ...chatmessages]


                    // aqui estamos obteniendo la lista de mensajes antiguos con las fechas de emision
                    const dataToReturn = GetListOfOldMessagesWithIssueDate(allMessages)


                    resolve(dataToReturn)
                })



                if (oldMessagesModified.length > 0) {
                    setChatMessages((prevMessages) => {
                        if (!listMessageAlreadyExist) {
                            return allMessagesForUpdate
                        } else {
                            return [...prevMessages]
                        }

                    })

                }


            }



        }

        RunAllFunc()

    }, [isUserInRecentMessagesArea, isUserInGetOldMessagesArea]);



    /* ************ Aqui Obtenemos los datos del usuario y los adaptamos para que agrege la propiedad chat_id y chat_type  
    ******* */
    useEffect(() => {

        const RunAllFunc = async () => {
            try {

                const resp = await GetUserData()
                dispatch(updateUserData(resp))


                // Aqui estamos validando que ancgo de la pagina se mayor que 768 para que cuando el usuario este en dispositivos como laptops el menu del chat deje de estar en absolute y no se oculte
                if (screen.width > 768) setMenuOpen(true)


                const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


                const dataForEmit = { authToken: `Bearer ${accessToken}` }
                socket.emit(GET_USER_SOCKET_ID_EVENT, dataForEmit)



                const HandlerOfUserSocketIdUpdated = async (response: HandlerOfUserSocketIdUpdatedPayload) => {
                    try {

                        if (response.status === 'FAILED') {
                            // aqui si la fallo la actualizacion del socket id en el registro de nuestro usario, se lanza una notificacion toast y se pone el valor de setIsUserSocketIDUpdated en false para que no la logica relacionada a la obtencion de participantes del chat y grupos no puedo ejecutarse 

                            setIsUserSocketIDUpdated(false)

                            // console.log(response)
                            throw { error: { message: 'Update the socketid value fail' } }
                        }


                        const userDataObteined = await GetUserDataValidated()

                        const newuserData = {
                            ...userDataObteined,
                            chat_id: '',
                            chat_type: ''
                        }

                        // console.log(newuserData)
                        // setUserData(newuserData)
                        dispatch(updateUserData(newuserData))

                        setIsUserSocketIDUpdated(true)
                        // console.log(response)
                        // console.log(userData)

                    } catch (error) {
                        router.push('/profile')
                    }
                }

                socket.on(GET_USER_SOCKET_ID_EVENT, HandlerOfUserSocketIdUpdated)



                // ********** Aqui Obtemos la lista de los grupos y los actualizamos con todas la notificaciones del usuario tanto de tipo grupo como contact ******


                const notificationsObtained = await GetAllNotificationsOfUser()



                const groupsObtained = await GetAllGroupChats()
                const contactsObtained = await GetAllContacts()

                // console.log(groupsObtained)
                // console.log(contactsObtained)


                // aqui estamos agregando el numero de notificaciones que tiene sin leer el usuario a cada grupo o chat de contacto  
                if (notificationsObtained) {


                    // aqui estamos obteniendo la lista de grupos ordenadas por cantidad de notificiaciones y con sus notificaciones integradas
                    const groupListOrdered = AddNotificationsToGroupList(groupsObtained, notificationsObtained)


                    // aqui estamos obteniendo la lista de contactos ordenadas por cantidad de notificiaciones y con sus notificaciones integradas
                    const contactsListOrdered = AddNotificationsToContactList(contactsObtained, notificationsObtained)


                    // console.log(groupListOrdered)
                    // console.log(contactsListOrdered)

                    dispatch(updateGroupChatList(groupListOrdered))
                    dispatch(updatecontactsList(contactsListOrdered))

                } else {

                    dispatch(updateGroupChatList(groupsObtained))
                    dispatch(updatecontactsList(contactsObtained))

                }




                socket.on("disconnect", async (reason) => {

                    // await UpdateSocketIdOfUser('empty')
                });

                return () => {
                    socket.off(GET_USER_SOCKET_ID_EVENT, HandlerOfUserSocketIdUpdated)
                }

            } catch (error) {
                console.log(error)
                router.push('/')
            }
        }

        RunAllFunc()


    }, [])


    /* ************ Aqui siempre que los valores userData.chat_id y numberOfMembers cambien se estara emitiendo un envento en el socket de tipo auth, ademas de obtener la lista de mensajes del nuevo chat que seleciono el usuario   ******* */
    useEffect(() => {
        try {

            const RunAllFunc = async () => {


                // console.log(isUserSocketIDUpdated)
                // console.log(userData.chat_id)


                // aqui salimos del flujo en el caso de que el cliente no haya seleccionado ningun chat y la propiedad chat_id este vacia
                if (!userData.chat_id) return



                // aqui cambiamos el valor de ThereUnreadMessages a falso cada vez que el usuario cambia de chat, para cuando se cree en mensajes de tipo unreadMessage en la funcion ContactMessageEventFunc o GroupMessageEventFunc 
                setThereUnreadMessages(false)



                /* ************ Aqui emitimos el evento de tipe participant joined to chat y actualizamos el status del usuario recien ingresado ******* */


                // aqui enviamos el token de auth y el chatid para que el backend pueda enlazar nuestro usuario con la lista de miembros de el id del chat y cuando el usuario salte de chat o agrege 
                const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)
                // console.log('Se emitio el evento de auth al inicio sin tener un chatid el user')


                // aqui validamos en que tipo de chat se encuentra el usuario y tipo de eventos debemos emitir al socket 
                if (userData.chat_type === GROUP_CHAT) {

                    socket.emit(A_PARTICIPANT_JOINED_THE_GROUP_CHAT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: userData.chat_id })

                } else if (userData.chat_type === CONTACT_CHAT) {

                    socket.emit(A_PARTICIPANT_JOINED_THE_CONTACT_CHAT_EVENT, { authToken: `Bearer ${accessToken}`, chatId: userData.chat_id, contactSocketId: contactData.contact_user.socket_id })
                }



                /* ************ Aqui obtenemos la lista de participantes y los modificiamos para que puedan mostrar en la vista en la seccion de mensajes ******* */

                let ParticipantsListModified: chatParticipantBody[] = []

                if (userData.chat_type === GROUP_CHAT) {


                    // aqui voy a obtener todos los participantes del chat y la fecha en la que se unieron al grupo y no agregamos logica similar para el de contactos, porque en el no se visualiza directamente los participantes del chat como en el del grupo 
                    const chatParticipantsList = await GetAllChatParticipantsOfGroup(userData.chat_id)


                    ParticipantsListModified = chatParticipantsList.chat_participants.map((participant: chatParticipantBody) => {
                        //  aqui estamos agregando solo una nueva propiedad que es message_type a todos los objetos de la lista de participantes, con el valor de unionDate, con la finalidad de poder diferenciarlo con los mensaje de tipo texto

                        const timestampToDate = new Date(participant.union_date)


                        const data: chatParticipantBody = {
                            ...participant,
                            union_date: timestampToDate.getTime(),
                            message_type: 'unionDate'
                        }
                        return data
                    })

                    // console.log('se volvio a ejecutar el useEffect con dependencias userData.chat_id, numberOfMembers')

                    // aqui estamos validando si este usuario es un admin o no, para permitirle que pueda eliminar miembros o ascender otros miembros a admins
                    const isUserAdmin = groupData.members.some((member) => member.user.user_id === userData.user_id && member.role === 'admin')

                    setIsUserAdminToGroup(isUserAdmin)

                }


                /* ************ Aqui obtenemos la lista de mensajes y los modificamos para que sean compatibles con el componente Message y se muestren en la vista ******* */

                // aqui obtenemos todos lo mesajes antiguos del chat de la db para mostrarlos en la vista  

                //aqui obtenemos la fecha, hora y minuto actual para utilizarla como filtro en la base de datos 
                const creationDate = GetCurrentDateString()


                const messagesLimit = 20

                // aqui estamos validando el tipo de chat que eligio el usuario, para llamar extrear mensajes de grupo o de contact
                const messagesList = (userData.chat_type === GROUP_CHAT) ?
                    await GetAllMessagesFromAGroupChat(userData.chat_id, messagesLimit, creationDate)
                    :
                    await GetAllMessagesFromAContactChat(userData.chat_id, messagesLimit, creationDate)


                // console.log(creationDate)
                // console.log(messagesList)
                // aqui estamos mapeando el array de mensajes obtenidos a la estructura de objeto que acepta el componente message


                const messagesListModified = ConvertBackendMessageBodyToViewableMessages(messagesList, userData)



                // *******AQUI AGREGAMOS LAS FECHAS DE EMISION DE LOS DIFERENTES GRUPOS DE MENSAJES CON FECHAS DIREFERENTE A LA LISTA DE MENSAJES ************ 

                const getMessages: ChatMessages = await new Promise((resolve) => {

                    let allMessages: (bodyMessageToShowInView | chatParticipantBody)[]

                    // aqui varificamos que el usario este en un chat de grupo o en uno de contacto, si esta en grupo se mostraran los participantes del grupo en la vista, pero si es chat de contacto, los participantes del chat no se visualizaran
                    if (userData.chat_type === GROUP_CHAT) {

                        allMessages = [...ParticipantsListModified, ...messagesListModified]

                    } else {
                        allMessages = [...messagesListModified]
                    }


                    const dataToReturn = GetListOfMessagesWithIssueDate(allMessages)

                    resolve(dataToReturn)
                })

                // console.log(messagesListModified)

                // aqui combinamos en un mismo array los arrays de chatParticipantsList y messagesListModified para luego ordenarlos por el metodo sort()
                const combineOflists = getMessages

                const orderlistForDate = combineOflists.sort((a, b) => {
                    if ('union_date' in a && 'timestamp' in b) {
                        const aDate = a.union_date as number;
                        const bDate = b.timestamp as number;
                        return aDate - bDate
                    }

                    return 0
                })

                // console.log(orderlistForDate)

                // aqui actualizamos la lista de mensajes con la notificacion de que un nuevo intregrante se unio en el grupo y los mensajes del grupo
                setChatMessages(orderlistForDate)


            }

            RunAllFunc()



        } catch (error) {
            router.push('/chats')
        }

    }, [userData.chat_id, numberOfMembers])




    /* ************ Aqui siempre que los valores chatmessages, userData.chat_type cambien se estara emitiendo un evento o de contact o de group que enviara el nuevo mensaje al socket para que este los almenacene en la base de datos y lo diriga a los demas miembros del chat, ademas de automaticamente desconectarnos para evitar problemas con el socket   ******* */
    useEffect(() => {
        try {




            // DownToRecentMessageAreaHandler()


            // console.log('se volvio a ejecutar el useEffect con dependencias de los sockets ios')

            const ContactMessageEventFunc = async (message: ContactMessageEventFuncProps) => {


                const messageData = message as bodyMessageToShowInView

                // Aqui actualizamos la lista de mensajes del chat

                // esta logica de la condicional se ejecutara siempre que el usuario se encuentre en el area de mensajes recientes 
                if (isUserInRecentMessagesArea && !contactData.is_blocked && !contactData.contact_user.contact_blocked_you && messagesContainer.current) {



                    setIsUserInRecentMessagesArea(true)
                    messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
                    setChatMessages([...chatmessages, messageData])
                }


                // esta logica de la condicional se ejecutara siempre que el usuario no se encuentre en el area de mensajes recientes 
                if (!isUserInRecentMessagesArea && chatmessages.length > 0 && !contactData.is_blocked && !contactData.contact_user.contact_blocked_you) {
                    // console.log('se esta ejecutando esto igual')

                    // aqui estamos creando un nuevo objeto con el valor de user_id cambiado a el id de usuario al cual le llego el mensaje, para que este sea guardado en la tabla de notificaciones como una notificacion unica de este usuario y su id
                    const notificacionBody = {
                        ...message,
                        user_id: userData.user_id
                    }

                    const notificationId = await CreateNewContactChatNotification(notificacionBody)


                    // aqui aumentamos el valor de numberOfUnreadMessages si el usuario sigue estando fuera del area de los mensajes recientes

                    if (numberOfUnreadMessages >= 0 && numberOfUnreadMessagesForIcon >= 0) {
                        //aqui estamos aumentando el valor de numberOfUnreadMessagesForIcon cuando numberOfUnreadMessages ya contenga un valor mayor a cero dentro y luego ese valor se viaulizara como el nuevo valor de mesajes no leidos y en el icono correspondiente 
                        setNumberOfUnreadMessagesForIcon((prevNumber) => prevNumber + 1)
                        setNumberOfUnreadMessages(numberOfUnreadMessagesForIcon + 1)
                    }


                    let newMessagesList: ChatMessages = []

                    // aqui validamos si ya ahi un elemento que indica la cantidad de mensajes no leidos en el chat,y que si existe, que no cree mas elementos de notificacion y solo aumente los mensajes despues de ese elemento, esto se logra gracias a que el valor de thereUnreadMessages es inicialmente falso, y cuando este pase a verdadero ya no se agregaran mas elementos de notificacion 

                    if (!thereUnreadMessages) {
                        setThereUnreadMessages(true)
                        const notificacionData = {
                            notification_id: notificationId,
                            message_type: 'unreadMessage'
                        }

                        newMessagesList = [...chatmessages, notificacionData, messageData]

                    } else {

                        newMessagesList = [...chatmessages, messageData]

                    }

                    setChatMessages(newMessagesList)

                }

                // console.log(chatmessages)
                // console.log(message)


            }




            const GroupMessageEventFunc = async (message: GroupMessageEventFuncProps) => {


                const messageData = message as bodyMessageToShowInView

                // console.log(isUserInRecentMessagesArea)
                // Aqui actualizamos la lista de mensajes del chat

                if (isUserInRecentMessagesArea && messagesContainer.current) {

                    setIsUserInRecentMessagesArea(true)
                    messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
                    setChatMessages([...chatmessages, messageData])
                }



                if (!isUserInRecentMessagesArea) {
                    // console.log('se esta ejecutando esto igual')

                    // aqui estamos creando un nuevo objeto con el valor de user_id cambiado a el id de usuario al cual le llego el mensaje, para que este sea guardado en la tabla de notificaciones como una notificacion unica de este usuario y su id
                    const notificacionBody = {
                        ...message,
                        user_id: userData.user_id
                    }

                    // TODO 
                    const notificationId = await CreateNewGroupChatNotification(notificacionBody)


                    // aqui aumentamos el valor de numberOfUnreadMessages si el usuario sigue estando fuera del area de los mensajes recientes

                    if (numberOfUnreadMessages >= 0 && numberOfUnreadMessagesForIcon >= 0) {
                        //aqui estamos aumentando el valor de numberOfUnreadMessagesForIcon cuando numberOfUnreadMessages ya contenga un valor mayor a cero dentro y luego ese valor se viaulizara como el nuevo valor de mesajes no leidos y en el icono correspondiente 

                        setNumberOfUnreadMessagesForIcon((prevNumber) => prevNumber + 1)
                        setNumberOfUnreadMessages(numberOfUnreadMessagesForIcon + 1)
                    }


                    let newMessagesList: ChatMessages = []

                    // aqui validamos si ya ahi un elemento que indica la cantidad de mensajes no leidos en el chat,y que si existe, que no cree mas elementos de notificacion y solo aumente los mensajes despues de ese elemento, esto se logra gracias a que el valor de thereUnreadMessages es inicialmente falso, y cuando este pase a verdadero ya no se agregaran mas elementos de notificacion 

                    if (!thereUnreadMessages) {
                        setThereUnreadMessages(true)
                        const notificacionData: notificationBodyInChatMessages = {
                            notification_id: notificationId,
                            message_type: 'unreadMessage'
                        }

                        newMessagesList = [...chatmessages, notificacionData, messageData]

                    } else {

                        newMessagesList = [...chatmessages, messageData]

                    }

                    setChatMessages(newMessagesList)

                }

                // console.log(chatmessages)
                // console.log(message)

            }




            if (userData.chat_type === GROUP_CHAT) {
                socket.on(GROUP_MESSAGE_EVENT, GroupMessageEventFunc)
            } else {
                socket.on(CONTACT_MESSAGE_EVENT, ContactMessageEventFunc)
            }





            const NewMemberGroupFunc = async (newMemberData: NewMemberGroupFuncProps) => {

                // Region que crear procesa los mensaje para mostrarlos en la vista
                //#region 
                // console.log(`se esta corriendo el evento ${NEW_GROUP_MEMBER_EVENT}`)

                // aqui voy a obtener todos los participantes del chat y la fecha en la que se unieron al grupo
                const chatParticipantsList = await GetAllChatParticipantsOfGroup(newMemberData.chat_id)


                // aqui filtramos la lista por el user_id de nuevo miembro que se unio al grupo  
                const participantFound = chatParticipantsList.chat_participants.filter((participant) => participant.user_id === newMemberData.user_id)

                //  aqui estamos agregando solo una nueva propiedad que es message_type al objeto del participante obtenido por filtrado, dandole el valor de unionDate, con la finalidad de poder diferenciarlo con los mensaje de tipo texto

                const newParticipantToChat = {
                    ...participantFound[0],
                    message_type: 'unionDate'
                }

                // console.log(newParticipantToChat)


                // aqui combinamos en un mismo array los arrays de chatParticipantsList y messagesListModified para luego ordenarlos por el metodo sort()
                const newMessagesList = [...chatmessages, newParticipantToChat]


                // aqui actualizamos la lista de mensajes con la notificacion de que un nuevo intregrante se unio en el grupo
                setChatMessages(newMessagesList)




                /* *********** aqui actualizamos lista de miembros mas el nuevo miembro, para miembros antiguos  *********** */
                // aqui estamos actualizando la lista de miembros en tiempo real para cada uno de los usuarios dentro del grupo, cada que un nuevo usuario se haya unido recientemente al grupo por medio de la funcion HandlerJoinToChannel(), la lista de miembros cada uno de los usuarios antiguos del grupo, se actualizara, agregando al nuevo usuario recien unido.

                const allParticipantsObtained = chatParticipantsList.chat_participants

                const membersListObtained = await
                    GetAllMembersOfGroup(newMemberData.group_id)

                // aqui estamos mapeando los datos para obtener un nuevo array con el nuevo miembro del grupo y con los status de los miembros actualizado, mas el del nuevo miembro que parecera siempre en inactive  
                const membersList = AddStatusToTheDataOfEachGroupMember(membersListObtained, allParticipantsObtained)

                // aqui le asignamos el array mapeado a la data de group
                const groupDataNewObject = {
                    ...groupData,
                    members: membersList
                }

                // console.log(groupDataNewObject)

                dispatch(updateGroupData(groupDataNewObject))


                //#endregion
            }

            socket.on(NEW_GROUP_MEMBER_EVENT, NewMemberGroupFunc)



            // ******** SOCKET PARA EL ESTATUS A ACTIVO DE UN PARTICIPANTE EN UN GROUP CHAT ***********/
            const AParticipantIsJoinedToGroupChat = async (joinData: AParticipantIsJoinedToGroupChatProps) => {

                const membersListObtained = await
                    GetAllMembersOfGroup(groupData.group_id)

                const chatParticipants = await GetAllChatParticipantsOfGroup(joinData.chat_id)

                const allParticipantsObtained = chatParticipants.chat_participants

                // aqui estamos mapeando y filtrando los datos para que se nos devuelva un nuevo array que tenga el estado y el socketid incluido en la data de cada miembro  
                const membersList = AddStatusToTheDataOfEachGroupMember(membersListObtained, allParticipantsObtained)


                const groupDataNewObject = {
                    ...groupData,
                    members: membersList
                }

                // console.log(groupDataNewObject.members)
                dispatch(updateGroupData(groupDataNewObject))

            }

            socket.on(A_PARTICIPANT_JOINED_THE_GROUP_CHAT_EVENT, AParticipantIsJoinedToGroupChat)


            // ******** SOCKET PARA EL ESTATUS A INACTIVO DE UN PARTICIPANTE EN UN GROUP CHAT ***********/
            const AParticipantIsUnjoinedToGroupChat = async (unjoinData: AParticipantIsUnjoinedToGroupChatProps) => {

                const chatParticipants = await GetAllChatParticipantsOfGroup(unjoinData.chat_id)

                const allParticipantsObtained = chatParticipants.chat_participants

                // aqui estamos mapeando y filtrando los datos para que se nos devuelva un nuevo array que tenga el estado y el socketid incluido en la data de cada miembro  
                const membersList = AddStatusToTheDataOfEachGroupMember(groupData.members, allParticipantsObtained)


                const groupDataNewObject = {
                    ...groupData,
                    members: membersList
                }

                // console.log(groupDataNewObject.members)
                dispatch(updateGroupData(groupDataNewObject))



            }

            socket.on(A_PARTICIPANT_UNJOINED_TO_GROUP_CHAT_EVENT, AParticipantIsUnjoinedToGroupChat)


            // ******** SOCKET PARA EL ESTATUS A ACTIVO DE UN PARTICIPANTE EN UN CONTACT CHAT ***********/
            const AParticipantIsJoinedToContactChat = async (data: AParticipantIsJoinedToContactChatProps) => {

                // console.log('se ejecuto la funcion AParticipantIsJoinedToContactChat')

                const contactsListObtained = await
                    GetAllContacts()

                // console.log(contactsListObtained)

                dispatch(updatecontactsList(contactsListObtained))


                // aqui obtenemos los datos mas recientes del chat de contacto en el que esta el usuario, esto para evitar obtener datos desactualizados y afectar la logica de la app 
                const contactDataObtained = await GetContactChatData(data.chat_id, data.contact_user_id)


                // console.log(contactDataObtained)
                dispatch(updateContactData(contactDataObtained))


            }


            socket.on(A_PARTICIPANT_JOINED_THE_CONTACT_CHAT_EVENT, AParticipantIsJoinedToContactChat)



            // ******** SOCKET PARA EL ESTATUS A INACTIVO DE UN PARTICIPANTE EN UN CONTACT CHAT ***********/
            const AParticipantIsUnjoinedToContactChat = async (data: AParticipantIsUnjoinedToContactChatProps) => {

                const contactsListObtained = await
                    GetAllContacts()

                dispatch(updatecontactsList(contactsListObtained))

                if (data.chat_id === contactData.chat_id) {
                    // aqui obtenemos los datos mas recientes del chat de contacto en el que esta el usuario, esto para evitar obtener datos desactualizados y afectar la logica de la app 
                    const contactDataObtained = await GetContactChatData(contactData.chat_id, data.contact_user_id)


                    // console.log(contactDataObtained)
                    dispatch(updateContactData(contactDataObtained))
                }

            }

            socket.on(A_PARTICIPANT_UNJOINED_TO_CONTACT_CHAT_EVENT, AParticipantIsUnjoinedToContactChat)



            // ******** SOCKET PARA PASAR UN CONTACTO DE OFFLINE A ONLINE APENA SE CONECTE A LA PAGINA ***********/
            const AContactIsOnline = async () => {

                // console.log('se ejecuto la funcion AContactIsOnline')

                const contactsListObtained = await
                    GetAllContacts()


                // dispatch(contactsListObtained)

                const newContactData = contactsListObtained.filter((contact) => contact.contact_user.user_id === contactData.contact_user.user_id)

                // console.log(newContactData[0])

                if (newContactData[0]) dispatch(updateContactData(newContactData[0]))

            }


            socket.on(USER_IS_ONLINE_EVENT, AContactIsOnline)



            const GroupNotificationMessageRecived = async (notificationData: GroupNotificationMessageRecivedProps) => {
                // console.log('se activo la funcion NotificationMessageRecived')

                const notificationDataObtained = notificationData.currentNotificationData

                NotificationToast(notificationDataObtained.message, notificationDataObtained.creator_userName, notificationDataObtained.creator_profile_picture)

                const userNotificiationsList = notificationData.userNotificiationsList

                // console.log(userNotificiationsList)

                const groupsObtained = await GetAllGroupChats()

                if (userNotificiationsList.length > 0) {
                    // const groupListModificated = groupsObtained.map((groupData) => {

                    //     const notificationFound = userNotificiationsList.filter((notification) => notification.chat_id === groupData.group.chat_id)

                    //     console.log(notificationFound)

                    //     if (notificationFound) {

                    //         const notificonsNumber = notificationFound.length

                    //         return {
                    //             ...groupData,
                    //             notifications_number: notificonsNumber
                    //         }
                    //     }


                    //     return {
                    //         ...groupData,
                    //         notifications_number: 0
                    //     }


                    // })

                    // // console.log(userNotificiationsList)
                    // // console.log(groupListModificated)


                    // const groupListOrdered = groupListModificated.sort((a: any, b: any) => b.notifications_number - a.notifications_number)

                    const groupListOrdered = ObtainGroupListWithUpdatedNotificationNumber(groupsObtained, userNotificiationsList)

                    dispatch(updateGroupChatList(groupListOrdered))

                    return
                }

                return

            }



            socket.on(GROUP_NOTIFICATION_MESSAGE_EVENT, GroupNotificationMessageRecived)



            const ContactNotificationMessageRecived = async (notificationData: ContactNotificationMessageRecivedProps) => {
                console.log('se activo la funcion NotificationMessageRecived')

                const notificationDataObtained = notificationData.currentNotificationData

                NotificationToast(notificationDataObtained.message, notificationDataObtained.creator_userName, notificationDataObtained.creator_profile_picture)

                const userNotificiationsList = notificationData.userNotificiationsList

                // console.log(userNotificiationsList)


                const contactsObtained = await GetAllContacts()

                if (userNotificiationsList.length > 0) {
                    // const contactListModificated = contactsObtained.map((contactData: any) => {

                    //     const notificationFound = userNotificiationsList.filter((notification: any) => notification.chat_id === contactData.chat_id)

                    //     console.log(notificationFound)

                    //     if (notificationFound) {

                    //         const notificonsNumber = notificationFound.length

                    //         return {
                    //             ...contactData,
                    //             notifications_number: notificonsNumber
                    //         }
                    //     }


                    //     return {
                    //         ...contactData,
                    //         notifications_number: 0
                    //     }


                    // })

                    // // console.log(userNotificiationsList)
                    // // console.log(contactListModificated)


                    // const contactListOrdered = contactListModificated.sort((a: any, b: any) => b.notifications_number - a.notifications_number)

                    const contactListOrdered = ObtainContactListWithUpdatedNotificationNumber(contactsObtained, userNotificiationsList)

                    dispatch(updatecontactsList(contactListOrdered))

                    return
                }

                // dispatch(updatecontactsList(contactsObtained))

                return
            }



            socket.on(CONTACT_NOTIFICATION_MESSAGE_EVENT, ContactNotificationMessageRecived)



            const AParticipantChagedToRoleChat = (memberData: AParticipantChagedToRoleChatProps) => {

                const memberId = memberData.member_id

                // aqui actualizamos el role del miembro que fue ascendido a admin
                const memberListUpdated = UpdatePromotedMemberRoleToAdmin(groupData, memberId)

                // aqui actualizamos la lista de miembros en el datos del grupo
                const newGroupData = {
                    ...groupData,
                    members: memberListUpdated
                }

                dispatch(updateGroupData(newGroupData))

            }

            socket.on(A_PARTICIPANT_CHANGED_TO_ROLE_EVENT, AParticipantChagedToRoleChat)



            const AParticipantWasDeletedByAdminToChat = async (memberDeletedData: AParticipantWasDeletedByAdminToChatProps) => {

                // aqui filtramos al miembro que fue recientemente eliminado
                const newMembersList = groupData.members.filter((member) => member.user.user_id !== memberDeletedData.member_id)

                // aqui actualizamos la lista de miembros sin el miembro recientemente eleminado en los datos de grupos
                const groupDataNewObject = {
                    ...groupData,
                    members: newMembersList
                }

                // console.log(groupDataNewObject.members)
                dispatch(updateGroupData(groupDataNewObject))

                // aqui emitimos un evento para que en el momento de ser eliminado el miembro, si este se encuentra activo en el chat, este sea expulsado automaticamente 
                if (userData.user_id === memberDeletedData.member_id) {
                    const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)


                    const dataForMemberLeaveToRoom = { authToken: `Bearer ${accessToken}`, chatId: memberDeletedData.chat_id }

                    socket.emit(A_ADMIN_HAS_DELETED_YOU_CHAT_EVENT, dataForMemberLeaveToRoom)

                    BackToMenuHandler()
                }

            }

            socket.on(A_PARTICIPANT_DELETED_BY_ADMIN_CHAT_EVENT, AParticipantWasDeletedByAdminToChat)


            const AParticipantLeftTheGroupToChat = async (memberLeftData: AParticipantLeftTheGroupToChatProps) => {

                const memberIdLeft = memberLeftData.member_id_Left

                // aqui filtramos al miembro que dejo el grupo voluntariamente 
                const newMembersList = groupData.members.filter((member) => member.user.user_id !== memberIdLeft)

                const groupDataNewObject = {
                    ...groupData,
                    members: newMembersList
                }

                // console.log(groupDataNewObject.members)
                dispatch(updateGroupData(groupDataNewObject))

            }

            socket.on(A_PARTICIPANT_LEFT_THE_GROUP_CHAT_EVENT, AParticipantLeftTheGroupToChat)


            const ContactBlockingForNotKnowingTheUser = async (data: ContactBlockingForNotKnowingTheUserProps) => {

                // aqui obtenemos los datos mas recientes del chat de contacto contacto en el que esta el usuario, ya que el contacto ejecuto un evento de bloqueo a este, y tenemos actulizar los datos para evitar que el contacto o el usuario puedan recibir mensajes
                const contactDataObtained = await GetContactChatData(data.chat_id, data.contact_user_id)


                // console.log(contactDataObtained)
                dispatch(updateContactData(contactDataObtained))

            }

            socket.on(BLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, ContactBlockingForNotKnowingTheUser)


            const ContactUnlockUser = async (data: ContactUnlockUserProps) => {

                // aqui obtenemos los datos mas recientes del chat de contacto contacto en el que esta el usuario, ya que el contacto ejecuto un evento de bloqueo a este, y tenemos actulizar los datos para evitar que el contacto o el usuario puedan recibir mensajes
                const contactDataObtained = await GetContactChatData(data.chat_id, data.contact_user_id)


                // console.log(contactDataObtained)
                dispatch(updateContactData(contactDataObtained))


            }

            socket.on(UNLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, ContactUnlockUser)


            const ContactDeleteTheUser = async (data: ContactDeleteTheUserProps) => {

                // aqui obtenemos la lista de contactos actualizada mas recientes del chat de contacto contacto en el que esta el usuario, ya que el contacto ejecuto un evento de eliminacion de contacto a este usuario, y tenemos actualizar los datos para evitar que haya errores
                const contactDataObtained = await GetContactChatData(data.chat_id, data.contact_user_id)

                // aqui obtenemos toda la lista de contactos
                const contactListObtained = await
                GetAllContacts()


                if(contactData){
                    // console.log(contactDataObtained)
                    dispatch(updateContactData(contactDataObtained))
                    // console.log(contactData)
                }
                
                dispatch(updatecontactsList(contactListObtained))
                // console.log(contactsList)

                
            }

            socket.on(DELETION_EXECUTED_BY_USER_TO_CONTACT_EVENT, ContactDeleteTheUser)


            const ContactIsInTheRecentMesssagesArea = async (data: ContactIsInTheRecentMesssagesAreaProps) => {

                //aqui obtenemos el valor si el contacto se encuentra en el area de mesanjes recientes leyendo los mensajes mas reciente para que cuando el usuario mande algun mensaje, esto aprescan automaticamente como leido y si no lo esta en el area, aparescan como ho lo leidos

                setIsContactInRecentMessagesArea(data.is_contact_in_recent_messages_area);

                if (data.is_contact_in_recent_messages_area) {

                    let messageConversionToTrueCompleted = false
                    // aqui estamos filtrando todos los mnesajes que estan no leidos para despues actulizar su data en la db
                    const unreadMessagesList = chatmessages.filter((mess) => {
                        if ('is_read' in mess) {
                            return mess.message_type === 'text' && !mess.is_read
                        }
                    })

                    // console.log('aqui los elemento del array  unreadMessagesList')
                    // console.log(unreadMessagesList)

                    if (unreadMessagesList.length > 0) {

                        // aqui actualizamos la propiedade is_read de cada uno de los mensajes no leidos en la base de datos y los pasamos a true  
                        unreadMessagesList.forEach(async (mess) => {

                            const newReadStatus = true
                            const newReadTimestamp = GetCurrentDateString()

                            await UpdateMessageData(mess.message_id, newReadStatus, newReadTimestamp)
                        })

                        messageConversionToTrueCompleted = true
                    }

                    const ListChatMessagesUnreaded: listChatMessagesUnreaded[] = []

                    // aqui extraemos todos los mensajes que no han sido leidos y su indice en el array original de chatmessages 
                    chatmessages.forEach((mess, index: number) => {
                        if ('is_read' in mess) {

                            if (mess.message_type === 'text' && !mess.is_read) {
                                const messageUpdated = {
                                    message_index: index
                                }

                                ListChatMessagesUnreaded.push(messageUpdated)

                                return
                            }

                            return
                        }
                    })

                    if (ListChatMessagesUnreaded.length > 0 && messageConversionToTrueCompleted) {

                        // aqui iteramos cada unos de los mensajes que obtuvimos y cambiamos su propiedad is_read desde del array original chatmessages ubicandolo con el message_index que contiene el indice original de cada mensaje en el array de chatmessages 
                        ListChatMessagesUnreaded.forEach((mess) => {

                            const newReadStatus = true

                            if (chatmessages && 'is_read' in chatmessages[mess.message_index]) {
                                const messageUnread = chatmessages[mess.message_index] as bodyMessageToShowInView

                                messageUnread.is_read = newReadStatus

                                return

                            }

                        })

                    }


                }

            }

            socket.on(IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT, ContactIsInTheRecentMesssagesArea)


            return () => {
                // aqui actualizamos la posicion de scroll del chat para que el usuario cada vez que ingrese, le aparescan los mensajes mas recientes  

                // if (messagesContainer.current && isUserInRecentMessagesArea && !isUserInNewChat && messagesContainer.current.scrollTop !== messagesContainer.current.scrollHeight) {
                //     messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
                // }

                // if (messagesContainer.current && isUserInRecentMessagesArea && messagesContainer.current.scrollTop !== messagesContainer.current.scrollHeight) {
                //     messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
                //     setIsUserInNewChat(false)
                // }




                if (isUserInRecentMessagesArea) {
                    setIsGetOldMessagesAreaActive(true)
                }

                // if (observerForNotificationMessagesArea) observerForNotificationMessagesArea.disconnect()


                socket.off(GROUP_MESSAGE_EVENT, GroupMessageEventFunc)

                socket.off(CONTACT_MESSAGE_EVENT, ContactMessageEventFunc)


                socket.off(NEW_GROUP_MEMBER_EVENT, NewMemberGroupFunc)

                socket.off(A_PARTICIPANT_JOINED_THE_GROUP_CHAT_EVENT, AParticipantIsJoinedToGroupChat)

                socket.off(A_PARTICIPANT_UNJOINED_TO_GROUP_CHAT_EVENT, AParticipantIsUnjoinedToGroupChat)

                socket.off(A_PARTICIPANT_JOINED_THE_CONTACT_CHAT_EVENT, AParticipantIsJoinedToContactChat)

                socket.off(A_PARTICIPANT_UNJOINED_TO_CONTACT_CHAT_EVENT, AParticipantIsUnjoinedToContactChat)

                socket.off(USER_IS_ONLINE_EVENT, AContactIsOnline)


                socket.off(A_PARTICIPANT_DELETED_BY_ADMIN_CHAT_EVENT, AParticipantWasDeletedByAdminToChat)

                socket.off(A_PARTICIPANT_LEFT_THE_GROUP_CHAT_EVENT, AParticipantLeftTheGroupToChat)

                socket.off(A_PARTICIPANT_CHANGED_TO_ROLE_EVENT, AParticipantChagedToRoleChat)

                socket.off(GROUP_NOTIFICATION_MESSAGE_EVENT, GroupNotificationMessageRecived)

                socket.off(CONTACT_NOTIFICATION_MESSAGE_EVENT, ContactNotificationMessageRecived)

                socket.off(BLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, ContactBlockingForNotKnowingTheUser)

                socket.off(UNLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT, ContactUnlockUser)

                socket.off(IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT, ContactIsInTheRecentMesssagesArea)


            }


        } catch (error) {
            console.log(error)
            router.push('/profile')
        }

    }, [chatmessages, userData.chat_type, !userData.chat_type])



    // Enforce Limit
    useEffect(() => {
        const TOAST_LIMIT = 2

        LogicToLimitAmountOfToastOnScreen(toasts, TOAST_LIMIT, toast)

    }, [toasts])

    //#endregion

    useEffect(() => {

        setTimeout(() => {
            setloaderWaitingTime(true)
        }, 500)

    }, [])






    const propsForChat: PropsForChat = {
        MenuOpenHandler: MenuOpenHandler,
        userData: userData,
        groupData: groupData,
        contactData: contactData,
        lockImage: lockImage,
        OpenSettingsOfContactChat: OpenSettingsOfContactChat,
        messagesContainer: messagesContainer,
        ValidateUserInRecentMessageArea: ValidateUserInRecentMessageArea,
        getOldMessagesArea: getOldMessagesArea,
        logoForMessageArea: logoForMessageArea,
        BlockingForNotKnowingTheUser: BlockingForNotKnowingTheUser,
        AddThisContact: AddThisContact,
        chatmessages: chatmessages,
        numberOfUnreadMessages: numberOfUnreadMessages,
        recentMessagesArea: recentMessagesArea,
        isUserInRecentMessagesArea: isUserInRecentMessagesArea,
        numberOfUnreadMessagesForIcon: numberOfUnreadMessagesForIcon,
        DownToRecentMessageAreaHandler: DownToRecentMessageAreaHandler,
        GroupMessageSendingHandle: GroupMessageSendingHandle,
        ContactMessageSendingHandle: ContactMessageSendingHandle,
        message: message,
        changeValueOfMessage: changeValueOfMessage
    }

    const propsForMenuChat: PropsForMenuChat = {
        menuOpen: menuOpen,
        isOpenAChat: isOpenAChat,
        OpenCardToSelectOptions: OpenCardToSelectOptions,
        groupChatsList: groupChatsList,
        CloseMenuOpenGroupChatHandler: CloseMenuOpenGroupChatHandler,
        contactsList: contactsList,
        CloseMenuOpenContactChatHandler: CloseMenuOpenContactChatHandler,
        lockImage: lockImage,
        OpenNavigationMenuHandler: OpenNavigationMenuHandler,
        navigationMenuOpen: navigationMenuOpen,
        infoForNavMenuChat: infoForNavMenuChat,
        LogOutHandler: LogOutHandler
    }

    const propsForGroupChat: PropsForGroupChat = {
        userData: userData,
        menuOpen: menuOpen,
        isOpenAChat: isOpenAChat,
        BackToMenuHandler: BackToMenuHandler,
        OpenLeaveToGroupCard: OpenLeaveToGroupCard,
        groupData: groupData,
        OpenCardOfChangeRoleOfMember: OpenCardOfChangeRoleOfMember,
        CopyInvitationId: CopyInvitationId,
        inputOfInvitationId: inputOfInvitationId,
        invitationId: invitationId,
        isInvitationIdCopied: isInvitationIdCopied,
        OpenNavigationMenuHandler: OpenNavigationMenuHandler,
        navigationMenuOpen: navigationMenuOpen,
        LogOutHandler: LogOutHandler
    }


    const propsForCommandWindows: PropsForCommandWindows = {
        isOpenCardToSelectOptions: isOpenCardToSelectOptions,
        isOpenChannelCreationCard: isOpenChannelCreationCard,
        isOpenJoinCardToChat: isOpenJoinCardToChat,
        isOpenAddContactCard: isOpenAddContactCard,
        wasNewIvitationIdCreated: wasNewIvitationIdCreated,
        isOpenCardToLeaveToGroup: isOpenCardToLeaveToGroup,
        OpenCardToCreateChannel: OpenCardToCreateChannel,
        OpenCardToJoinChannel: OpenCardToJoinChannel,
        OpenCardToAddContact: OpenCardToAddContact,
        CloseCardToSelectOptions: CloseCardToSelectOptions,
        HandlerCreateNewChannel: HandlerCreateNewChannel,
        formToCreateChannel: formToCreateChannel,
        CloseCardOfCreateChannel: CloseCardOfCreateChannel,
        CopyInvitationId: CopyInvitationId,
        inputOfInvitationId: inputOfInvitationId,
        invitationId: invitationId,
        isInvitationIdCopied: isInvitationIdCopied,
        CloseCardOfInvitationIdCreated: CloseCardOfInvitationIdCreated,
        HandlerJoinToChannel: HandlerJoinToChannel,
        formToJoinChannel: formToJoinChannel,
        setInvitationId: setInvitationId,
        CloseCardOfJoinToChannel: CloseCardOfJoinToChannel,
        RegisterNewContact: RegisterNewContact,
        HandlerSearchNewContacts: HandlerSearchNewContacts,
        formToCreateNewContact: formToCreateNewContact,
        searchNewContactValue: searchNewContactValue,
        listOfNewContactSearched: listOfNewContactSearched,
        SelectUserForToBeNewContact: SelectUserForToBeNewContact,
        SearchContactsOnPreviousPage: SearchContactsOnPreviousPage,
        offsetToSearchNewContacts: offsetToSearchNewContacts,
        SearchContactsOnNextPage: SearchContactsOnNextPage,
        userSelectedToBeNewContact: userSelectedToBeNewContact,
        DeleteContactSelected: DeleteContactSelected,
        CloseCardOfAddContact: CloseCardOfAddContact,
        LeaveTheGroup: LeaveTheGroup,
        CloseLeaveToGroupCard: CloseLeaveToGroupCard,
        isOpenCardToChangeRoleOfMember: isOpenCardToChangeRoleOfMember,
        isUserAdminToGroup: isUserAdminToGroup,
        DeleteMemberOfChat: DeleteMemberOfChat,
        ConvertMemberToAdmin: ConvertMemberToAdmin,
        CloseCardOfChangeRoleOfMember: CloseCardOfChangeRoleOfMember,
        isOpenSettingsOfContactChat: isOpenSettingsOfContactChat,
        DeleteChatHistory: DeleteChatHistory,
        UnlockThisContact: UnlockThisContact,
        BlockThisContact: BlockThisContact,
        DeleteThisContact: DeleteThisContact,
        CloseSettingsOfContactChat: CloseSettingsOfContactChat,
        BlockingForNotKnowingTheUser: BlockingForNotKnowingTheUser,
    }

    if (!loaderWaitingTime || !userData.user_id) {
        return (<div className="w-full h-screen flex flex-col justify-center items-center  bg-zinc-900 gap-3 " data-testid="LoaderBody"><div data-testid="LoaderIcon">{iconsPageLogo[0].icon}</div><p className="text-white animate-pulse" data-testid="LoaderMessage">Chatify</p></div>)
    }

    return (
        <div className="w-screen h-screen">
            <div className="w-full h-screen bg-zinc-800 flex flex-col justify-center items-center">
                <div className="w-full h-screen flex flex-row relative md:w-[97%] md:h-[95%]">

                    <MenuChat props={propsForMenuChat} />
                    <GroupMenuChat props={propsForGroupChat} />

                    <Chat props={propsForChat} />

                    {/* icon close */}
                    <div className={`${isOpenAChat || menuOpen ? "" : "hidden"} absolute w-9 h-9 flex flex-col justify-center items-center top-[16px] right-[3px] z-20 md:top-[12px] md:right-[14px] sm:top-[16px] sm:right-[20px] md:hidden`} onClick={MenuCloseHandler} >
                        <div className={`relative w-7 h-8 flex flex-col justify-center items-center bg-zinc-950 rounded-xl text-white `}>
                            {iconsForChatsPage[4].icon}</div>
                    </div>

                    <Commandwindows props={propsForCommandWindows} />

                </div>


                {/* ************** nos falta implementar estas cards  en la vista y despues empezar con el la logica*/}
                {/* card para crear o unirse a un chat grupal */}

                {/*                 
                <div className={`${isOpenCardToSelectOptions || isOpenChannelCreationCard || isOpenJoinCardToChat || isOpenAddContactCard || wasNewIvitationIdCreated || isOpenCardToLeaveToGroup ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`} >

                    <div className={`${isOpenCardToSelectOptions ? "" : "hidden"} relative w-[90%] h-72 flex flex-col justify-center items-center gap-5 bg-zinc-950 rounded-xl text-white sm:w-80 md:w-80 `} >
                        <button onClick={OpenCardToCreateChannel} className="w-[65%] py-3 bg-blue-500 rounded-lg">Create New Channel</button>
                        <button onClick={OpenCardToJoinChannel} className="w-[65%] py-3 bg-blue-500 rounded-lg">Enter to a Channel</button>
                        <div className="w-7 h-1 bg-zinc-500 rounded-md " ></div>
                        <button onClick={OpenCardToAddContact} className="w-[65%] py-3 bg-green-500 rounded-lg">Add New Contact</button>
                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardToSelectOptions} >{iconsForChatsPage[4].icon}</div>
                    </div>



                    <div className={`${isOpenChannelCreationCard ? "" : "hidden"} relative w-[90%] h-[28.125rem] flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                        <h3>New Channel</h3>
                        <form onSubmit={HandlerCreateNewChannel} ref={formToCreateChannel} className="w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%] ">
                            <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Channel name" id="channelName" name="channelName" />
                            <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Password Channel" id="channelPassword" name="channelPassword" />
                            <textarea className="outline-none w-full h-28 resize-none p-3 text-sm rounded-lg bg-zinc-700" name="channelDescription" id="channelDescription" placeholder="Channel Description"  ></textarea>
                            <input className="outline-none w-[60%] py-3 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32  md:self-end" type="button"
                                value="Save" onClick={HandlerCreateNewChannel} />
                        </form>
                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfCreateChannel} >{iconsForChatsPage[4].icon}</div>
                    </div>



                    <div className={`${wasNewIvitationIdCreated ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                        <h3>Invitation id</h3>

                        <div className='w-[80%] h-14 self flex flex-row justify-between items-center bg-zinc-700 p-3 gap-5 rounded-xl' onClick={CopyInvitationId}>
                            <input ref={inputOfInvitationId}
                                id="invitationIdInput" type="text" className='w-full flex flex-col justify-center items-start   whitespace-nowrap overflow-hidden selection:bg-transparent bg-zinc-700  text-white outline-none caret-transparent select ' onClick={CopyInvitationId} defaultValue={invitationId} />

                            <div onClick={CopyInvitationId} className='flex flex-col justify-center items-center w-4 h-4'>{!isInvitationIdCopied ? iconsForChatsPage[8].icon : iconsForChatsPage[9].icon}</div>
                        </div>

                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfInvitationIdCreated} >{iconsForChatsPage[4].icon}</div>


                    </div>

                    <div className={`${isOpenJoinCardToChat ? "" : "hidden"} relative w-[90%] h-72 flex flex-col justify-center items-center gap-8  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                        <h3>Join to a Channel</h3>
                        <form onSubmit={HandlerJoinToChannel} ref={formToJoinChannel} className="w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%]">
                            <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Insert Invitation Id" id="invitationId" name="invitationId" value={invitationId} onChange={(e) => setInvitationId(e.target.value)} />
                            <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Insert Password" id="channelPassword" name="channelPassword" />
                            <input className="outline-none w-[50%] py-2 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32" type="button" value="Join" readOnly onClick={HandlerJoinToChannel} />
                        </form>
                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfJoinToChannel} >{iconsForChatsPage[4].icon}</div>
                    </div>

                    <div className={`${isOpenAddContactCard ? "" : "hidden"} relative w-[90%] h-96  flex flex-col pt-16 items-center mb-20 gap-8  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                        <h3>Add New Contact</h3>
                        <form onSubmit={RegisterNewContact} ref={formToCreateNewContact} className="relative w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%]">
                            <div className="w-full h-11 flex flex-row items-center gap-1 p-2 bg-zinc-600 rounded-md">
                                {iconsForChatsPage[1].icon}
                                <input className="w-full text-xs bg-transparent outline-none" type="text" value={searchNewContactValue} placeholder="Search" onChange={HandlerSearchNewContacts} />
                            </div>

                            {searchNewContactValue && listOfNewContactSearched.length > 0 && (<>
                                <div className="absolute top-12 w-full h-max-64 flex flex-col justify-start items-center gap-3 p-3 bg-zinc-950 rounded-md">
                                    <div className="w-full h-full flex flex-col justify-start items-center gap-3 p-3 overflow-scroll">
                                        {
                                            listOfNewContactSearched.map((contactFound): any => {
                                                return <div id={contactFound.user_id} key={contactFound.user_id}
                                                    className="w-full h-15 flex flex-row justify-start items-center gap-3 p-2 bg-zinc-600 rounded-md" onClick={SelectUserForToBeNewContact}>
                                                    <Image loading="eager" src={contactFound.profile_picture} id={contactFound.user_id} alt="ContactProfile" width="45" height="45" className="rounded-md" onClick={SelectUserForToBeNewContact} />
                                                    <p id={contactFound.user_id} onClick={SelectUserForToBeNewContact}>{contactFound.username}</p>
                                                </div>
                                            })
                                        }

                                    </div>

                                    <div className="px-4 py-2 flex flex-row bg-zinc-700 gap-2 rounded-md" >
                                        <div onClick={SearchContactsOnPreviousPage} className="bg-blue-600 rounded-md px-3 py-1" >{"<"}</div>
                                        <span className="w-5 text-center bg-transparent">{offsetToSearchNewContacts}</span>
                                        <div onClick={SearchContactsOnNextPage} className="bg-blue-600 rounded-md px-3 py-1">{">"}</div>
                                    </div>
                                </div>

                            </>
                            )
                            }


                            {searchNewContactValue && listOfNewContactSearched.length === 0 && (
                                <>
                                    <div className="absolute top-12 w-full h-max-64 flex flex-col justify-center items-center gap-3 p-3 bg-zinc-950 rounded-md">
                                        <div className="w-full h-full flex flex-col justify-center items-center gap-3 p-3 bg-red-500 rounded-lg">

                                            <span className="p-3 text-sm rounded-lg ">matches not found</span>

                                        </div>
                                    </div>
                                </>)
                            }


                            {userSelectedToBeNewContact.user_id ? (
                                <>
                                    <h4>User Selected</h4>
                                    <div className=" w-full h-15 flex flex-row justify-start items-center gap-3 p-2 bg-zinc-600 rounded-md">
                                        <Image loading="eager" src={userSelectedToBeNewContact.profile_picture} alt="ContactProfile" width="45" height="45" className="rounded-md" />
                                        <p>{userSelectedToBeNewContact.username}</p>
                                        <div className="w-7 h-7 flex felx-col justify-center items-center ml-auto rounded-full bg-zinc-700 hover:bg-red-500" onClick={DeleteContactSelected}>
                                            {iconsForChatsPage[4].icon}
                                        </div>
                                    </div>

                                </>

                            ) : (
                                <></>
                            )
                            }


                            <button className="outline-none w-[50%] py-2 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32" onClick={RegisterNewContact}>Add Contact</button>


                        </form>

                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfAddContact} >{iconsForChatsPage[4].icon}</div>
                    </div>


                    <div className={`${isOpenCardToLeaveToGroup ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[40%] xl:w-[30%]`}>

                        <button onClick={LeaveTheGroup} className="w-[65%] py-3 bg-red-500 rounded-lg">Leave To Group</button>

                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseLeaveToGroupCard} >{iconsForChatsPage[4].icon}</div>

                    </div>


                </div>


                <div className={`${isOpenCardToChangeRoleOfMember && isUserAdminToGroup ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}>

                    <div className={`${isOpenCardToChangeRoleOfMember && isUserAdminToGroup ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>

                        <button onClick={DeleteMemberOfChat} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Member</button>

                        <button onClick={ConvertMemberToAdmin} className="w-[65%] py-3 bg-blue-500 rounded-lg">Change Member To Admin</button>

                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfChangeRoleOfMember} >{iconsForChatsPage[4].icon}</div>
                    </div>

                </div>


                <div className={`${isOpenSettingsOfContactChat && userData.chat_type === CONTACT_CHAT ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}>

                    <div className={`${isOpenSettingsOfContactChat && userData.chat_type === CONTACT_CHAT ? "" : "hidden"} relative w-[90%] h-64 flex flex-col justify-center items-center py-24 gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>

                        <button onClick={DeleteChatHistory} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Chat History</button>

                        <button onClick={contactData.is_blocked ? UnlockThisContact : BlockThisContact} className="w-[65%] py-3 bg-blue-500 rounded-lg">{contactData.is_blocked ? 'Unlock this Contact' : 'Block this Contact'}</button>

                        <button onClick={DeleteThisContact} className="w-[65%] py-3 bg-blue-500 rounded-lg">Delete This Contact</button>

                        <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseSettingsOfContactChat} >{iconsForChatsPage[4].icon}</div>
                    </div>

                </div> */}


            </div >
        </div>
    )


    // #region

    // return (
    //     <div className="w-full h-screen bg-zinc-800 flex flex-col justify-center items-center">
    //         <div className="w-full h-screen flex flex-row relative md:w-[97%] md:h-[95%]">
    //             <div className={`${menuOpen && !isOpenAChat || userData.chat_type === CONTACT_CHAT && screen.width > 768 || userData.chat_type === '' && screen.width > 768 ? "" : "hidden"}  w-[282px] h-full bg-zinc-900 text-white absolute z-30  md:relative md:w-96 lg:w-96`} >
    //                 <div className="w-full h-full grid grid-cols-1 bg-zinc-900 menu-chat-area gap-2 ">
    //                     {/* chat de grupos */}
    //                     <div className="w-full flex flex-col [grid-area:channels]  justify-start items-start gap-2">
    //                         <div className="w-full h-16 flex flex-row justify-between items-center border-b-4 pl-7 pr-5 border-zinc-950 shadow drop-shadow-xl" >
    //                             {/* <div>{iconsForChatsPage[5].icon}</div> */}
    //                             <h1 className="font-semibold">Channels</h1>
    //                             <div className="w-6 h-6 flex flex-col justify-center items-center rounded-md bg-zinc-700" onClick={OpenCardToSelectOptions}>{iconsForChatsPage[0].icon}</div>
    //                         </div>

    //                         <div className="w-full flex flex-col justify-between items-start gap-7 pl-7 pr-5 overflow-hidden ">
    //                             <div className="w-full flex flex-row gap-1 p-2 bg-zinc-600 rounded-md">
    //                                 {iconsForChatsPage[1].icon}
    //                                 <input className="w-full text-xs bg-transparent outline-none" type="text" placeholder="Search" value={groupsListQuery} onChange={FilterGroupsList} />
    //                             </div>

    //                             <div className="w-full h-32 flex flex-col justify-start items-start gap-2 overflow-y-auto scroll-bar">
    //                                 {
    //                                     groupChatsList.map(({ group, notifications_number }: any) => {
    //                                         return <div id={group.group_id} key={group.group_id} className="w-full py-3 pr-4 flex flex-row justify-start items-center hover:pl-2 gap-3 hover:bg-zinc-700 rounded-lg" onClick={CloseMenuOpenGroupChatHandler}>
    //                                             <div id={group.group_id} onClick={CloseMenuOpenGroupChatHandler}>{group.group_icon}</div>
    //                                             <h2 id={group.group_id} className="w-auto h-6 whitespace-nowrap overflow-hidden " onClick={CloseMenuOpenGroupChatHandler}>{group.group_name}</h2>
    //                                             <p className={`${notifications_number > 0 ? '' : 'hidden'} w-6 h-6 flex flex-row justify-center  items-center ml-auto rounded-full bg-blue-500 text-sm`}>{notifications_number}</p>

    //                                         </div>
    //                                     })
    //                                 }

    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* chat de amigos  */}
    //                     <div className="w-full flex flex-col [grid-area:contacts] justify-start items-start pl-7 pr-5 gap-2">
    //                         <div className="w-full h-16 flex flex-row justify-between items-center border-t-2 border-zinc-700 ">
    //                             <h1 className="font-semibold">Contacts</h1>
    //                         </div>

    //                         <div className="w-full flex flex-col justify-between items-start gap-7 ">
    //                             <div className="w-full flex flex-row gap-1 p-2 bg-zinc-600 rounded-md">
    //                                 {iconsForChatsPage[1].icon}
    //                                 <input className="w-full text-xs bg-transparent outline-none" type="text" placeholder="Search"
    //                                     value={contactsListQuery} onChange={FilterContactList} />
    //                             </div>

    //                             <div className="w-full h-32 flex flex-col  justify-start items-start gap-3  overflow-y-auto scroll-bar ">
    //                                 {
    //                                     contactsList.map((contact: any) => {
    //                                         return <div key={contact.chat_id} id={contact.chat_id} className="w-full py-2 pr-4 flex flex-row items-center hover:pl-2 gap-3 hover:bg-zinc-700 rounded-lg" onClick={CloseMenuOpenContactChatHandler}>
    //                                             {contact.contact_user.profile_picture ? (<>
    //                                                 <Image loading="eager" id={contact.chat_id} alt="profile Picture" src={contact.contact_user.contact_blocked_you ? lockImage : contact.contact_user.profile_picture} width={38} height={38} className="rounded-lg" onClick={CloseMenuOpenContactChatHandler} />

    //                                             </>)
    //                                                 :
    //                                                 (<>
    //                                                     <div id={contact.chat_id} onClick={CloseMenuOpenContactChatHandler}>{contact.contact_user.contact_icon}</div>
    //                                                 </>)}

    //                                             <h2 id={contact.chat_id} onClick={CloseMenuOpenContactChatHandler} >{contact.contact_user.username}</h2>

    //                                             {/* Aqui signos de bloqueo y notificaciones */}
    //                                             <p className={`${contact.notifications_number > 0 ? '' : 'hidden'} w-6 h-6 flex flex-row justify-center  items-center ml-auto rounded-full bg-blue-500 text-sm`}>{contact.notifications_number}</p>
    //                                         </div>
    //                                     })
    //                                 }
    //                             </div>

    //                         </div>
    //                     </div>


    //                     <div className='w-full h-20 flex flex-row gap-4  items-center [grid-area:Navigation] self-end pl-7 pr-5' onClick={OpenNavigationMenuHandler} >
    //                         {!userData.profile_picture ? (<>
    //                             <div className="animate-pulse w-[40px] h-[40px] rounded-xl bg-zinc-200"></div>
    //                         </>) : (<>
    //                             <Image loading="eager" src={userData.profile_picture} className='rounded-lg' width="40" height="40" alt='profileImage' />
    //                         </>)
    //                         }
    //                         <p className=" md:flex md:flex-col md:justify-center">{userData.username}</p>
    //                         <div className="hidden md:flex-1 md:flex md:flex-col md:justify-center-end md:items-end">{

    //                             navigationMenuOpen ? (iconsArrowForNavMenuChats[1].icon) : (iconsArrowForNavMenuChats[0].icon)

    //                         }</div>
    //                         {
    //                             navigationMenuOpen &&
    //                             <ul className='w-56 absolute bottom-20 left-9 flex flex-col justify-between items-center gap-1 bg-zinc-800 border-zinc-700 border-2 rounded-xl p-4' >
    //                                 {
    //                                     infoForNavMenuChat.map((elem) => {
    //                                         return elem.funtionLogOut ?
    //                                             <li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li>
    //                                             :
    //                                             <Link key={elem.id} href={elem.link} className='w-full' ><li className={elem.class}>{elem.icon}<span>{elem.name}</span></li></Link>
    //                                     })
    //                                 }
    //                             </ul>
    //                         }

    //                     </div>
    //                 </div>


    //             </div>

    //             <div className={`${userData.chat_type === GROUP_CHAT && !menuOpen && isOpenAChat ? "" : "hidden"}  w-[282px] h-full bg-zinc-900 text-white absolute z-30 md:relative md:w-96 lg:w-96`} >
    //                 <div className="w-full h-full grid grid-cols-1 bg-zinc-900 menu-chat-area gap-6 ">
    //                     {/* chat de grupos */}
    //                     <div className="w-full flex flex-col [grid-area:channels]  justify-start items-start gap-2">
    //                         <div className="w-full h-16 flex flex-row justify-start items-center gap-4 border-b-4 pl-3 pr-5 border-zinc-950 shadow drop-shadow-xl" >
    //                             <div className="w-6 h-6 flex flex-col justify-center items-center" onClick={BackToMenuHandler}>{iconsForChatsPage[5].icon}</div>
    //                             <h1 className="font-semibold">All Channels</h1>

    //                             <div className="w-6 h-6 flex felx-col justify-center items-center ml-auto rounded-full hover:bg-red-500" onClick={OpenLeaveToGroupCard}>{iconsForChatsPage[10].icon}</div>
    //                         </div>

    //                         <div className="w-full flex flex-col justify-between items-start gap-7 pl-7 pr-5 ">
    //                             <div className="w-full flex flex-col gap-4">
    //                                 <h3 className="text-xl font-semibold">{groupData.group_name}</h3>
    //                                 <p>{groupData.description}</p>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* chat de amigos  */}
    //                     <div className="w-full flex flex-col [grid-area:contacts] justify-start items-start pl-7 pr-5 gap-5">
    //                         <div className="w-full h-10 flex flex-row justify-between items-center  border-zinc-700 ">
    //                             <h3 className="text-xl font-semibold">Members</h3>
    //                         </div>

    //                         <div className="w-full h-56 flex flex-col justify-start items-start gap-3 overflow-y-auto scroll-bar">
    //                             {/* <div className="w-full flex flex-col  justify-between items-start gap-3"> */}
    //                             {
    //                                 groupData.members.map((member: any) => {
    //                                     return <div id={member.user.user_id} key={member.user.user_id} className="w-full h-12  flex flex-row items-center hover:pl-2 gap-3 " onClick={OpenCardOfChangeRoleOfMember}>
    //                                         <Image loading="eager" src={member.user.profile_picture} width="35" height="35" className="rounded-md" alt='memberimageProfile' id={member.user.user_id} onClick={OpenCardOfChangeRoleOfMember} />
    //                                         <p id={member.user.user_id} className='w-8/12 whitespace-nowrap overflow-hidden truncate' onClick={OpenCardOfChangeRoleOfMember}>{member.user.name}</p>
    //                                         <div id={member.user.user_id} className={`${member.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}  w-2 h-2 rounded-full`} onClick={OpenCardOfChangeRoleOfMember}></div>
    //                                         <div className={`${member.role === 'admin' ? '' : 'hidden'} flex flex-col justify-center items-center w-4 h-4`} >{iconsForChatsPage[7].icon}</div>
    //                                     </div>

    //                                 })
    //                             }

    //                         </div>

    //                         {
    //                             groupData.members.map((member: any) => {
    //                                 return member.role === 'admin' && member.user.user_id === userData.user_id ? (<div id={member.user.user_id} key={member.user.group_id} className='w-full h-14 self flex flex-row justify-between items-center bg-zinc-700 p-3 gap-5 rounded-xl' onClick={CopyInvitationId}>
    //                                     <input ref={inputOfInvitationId} id={member.user.user_id} className='w-full flex flex-col justify-center items-start   whitespace-nowrap overflow-hidden selection:bg-transparent bg-zinc-700  text-white outline-none caret-transparent select ' onClick={CopyInvitationId} defaultValue={invitationId} />

    //                                     <div onClick={CopyInvitationId} className='flex flex-col justify-center items-center w-4 h-4'>{!isInvitationIdCopied ? iconsForChatsPage[8].icon : iconsForChatsPage[9].icon}</div>
    //                                 </div>) : (<></>)

    //                             })
    //                         }

    //                     </div>


    //                     <div className='w-full h-20 flex flex-row gap-4  items-center [grid-area:Navigation] self-end pl-7 pr-5' onClick={OpenNavigationMenuHandler} >
    //                         {!userData.profile_picture ? (<>
    //                             <div className="animate-pulse w-[40px] h-[40px] rounded-xl bg-zinc-700"></div>
    //                         </>) : (<>
    //                             <Image loading="eager" src={userData.profile_picture} className='rounded-lg' width="40" height="40" alt='profileImage' />
    //                         </>)
    //                         }
    //                         <p className=" md:flex md:flex-col md:justify-center">{userData.username}</p>
    //                         <div className="hidden md:flex-1 md:flex md:flex-col md:justify-center-end md:items-end">{

    //                             menuOpen ? (iconsArrowForNavMenuChats[1].icon) : (iconsArrowForNavMenuChats[0].icon)

    //                         }</div>
    //                         {
    //                             navigationMenuOpen &&
    //                             <ul className='w-56 absolute bottom-20 left-9 flex flex-col justify-between items-center gap-1 bg-zinc-800 border-zinc-700 border-2 rounded-xl p-4' >
    //                                 {
    //                                     infoForNavMenuChat.map((elem) => {
    //                                         return elem.funtionLogOut ?
    //                                             <li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li>
    //                                             :
    //                                             <Link href={elem.link} className='w-full' ><li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li></Link>
    //                                     })
    //                                 }
    //                             </ul>
    //                         }
    //                     </div>
    //                 </div>


    //             </div>





    //             {/* ************* Chats **************** */}
    //             <div className="w-full h-full flex flex-col justify-between text-white bg-zinc-700 pb-1">
    //                 <div className="relative w-full min-h-[63px] flex flex-row justify-start items-center bg-zinc-700 px-4 z-10 border-zinc-950 shadow drop-shadow-xl">
    //                     <div className={`mr-3 md:hidden`} onClick={MenuOpenHandler} >{iconsForChatsPage[3].icon}</div>



    //                     {/* **** aqui se mostrara el titulo del chat de grupo **** */}
    //                     {userData.chat_type === GROUP_CHAT && (<>

    //                         <div className="w-auto h-4/5 flex flex-row items-center gap-3 ">
    //                             <div className="w-10 h-10 flex flex-col justify-center items-center rounded-lg bg-zinc-900 ">{groupData.group_icon}</div>
    //                             <h2 className="w-48 font-semibold text-lg truncate overflow-hidden">{groupData.group_name}</h2>

    //                         </div>

    //                     </>)
    //                     }

    //                     {/* **** aqui se mostrara el titulo del chat de contacto **** */}
    //                     {
    //                         userData.chat_type === CONTACT_CHAT && (<>

    //                             <div className="w-auto h-4/5 flex flex-row items-center gap-3 ">
    //                                 <Image alt="Contact Picture" src={contactData.contact_user.contact_blocked_you || !contactData.contact_user.profile_picture ? lockImage : contactData.contact_user.profile_picture} width='40' height="40" className="rounded-lg" />
    //                                 <div className="flex flex-col gap-1">
    //                                     <h2 className="font-semibold text-base">{contactData.contact_user.username}</h2>
    //                                     <span className={`${contactData.contact_user.socket_id === 'empty' || contactData.contact_user.contact_blocked_you || contactData.is_blocked ? 'hidden' : ''} text-xs`}>{'online'}</span>
    //                                 </div>
    //                                 <div className={`${contactData.is_blocked ? '' : 'hidden'} flex flex-row gap-2 items-center `}> {iconsForChatsPage[12].icon}
    //                                     <p className="p-1 bg-red-700 rounded-lg">Bloqued</p>
    //                                 </div>

    //                             </div>

    //                         </>)

    //                     }

    //                     {/* **** aqui no se mostrara nada en caso de que el usuario no haya seleccionado ningun chat     **** */}
    //                     {
    //                         userData.chat_type === '' && (
    //                             <div className="w-auto h-4/5"></div>)
    //                     }

    //                     {
    //                         userData.chat_type === CONTACT_CHAT && (<>
    //                             <div onClick={OpenSettingsOfContactChat} className={`flex flex-row justify-center items-center w-8 h-8 absolute z-40 right-5`}>{iconsForChatsPage[11].icon}</div>
    //                         </>)

    //                     }

    //                 </div>
    //                 <div ref={messagesContainer} onScroll={ValidateUserInRecentMessageArea} className={`${userData.chat_type === CONTACT_CHAT || userData.chat_type === GROUP_CHAT ? 'p-2 default-background-for-chat py-[50px] lg:pt-[10px] lg:pb-[0px] md:p-7 scroll-bar overflow-y-auto ' : ''} relative  w-full h-full flex flex-col justify-start items-start  gap-6  `}>
    //                     {/* este elemento sirve como una interseccion para que obtengamos una cantidad de mensajes antiguos cada vez que la vista del usuario pase por esta area */}
    //                     <div className="relative w-full h-[0.5px]">
    //                         <div ref={getOldMessagesArea} className="absolute w-full h-[60px] top-0 left-auto z-10"></div>
    //                     </div>

    //                     {

    //                         userData.chat_type === '' && (<div className="w-full h-full flex flex-col justify-center items-center gap-7 ">
    //                             <Image alt="logoForMessageArea Picture" src={logoForMessageArea}
    //                                 width="280" height="280" className="w-[290px] h-[290px] md:w-[300px] md:h-[300px]" />
    //                             <div className="w-[80%] flex flex-col items-center justify-center gap-5 sm:w-[70%]">
    //                                 <p className="w-full text-zinc-100 text-center text-xl font-extralight md:text-2xl" >Download Chatify soon in ios and android application</p>
    //                                 <p className="text-zinc-400 text-sm text-center font-light sm:text-base" >Chatify soon in ios and android application</p>

    //                             </div>
    //                             {/* <button className="text-zinc-200 py-3 px-5 rounded-full font-light bg-blue-500 hover:bg-blue-200">Get more information</button>
    //                              */}
    //                             <div className="text-zinc-200 py-3 px-5 rounded-full font-light cursor-pointer bg-blue-500 hover:bg-blue-700 z-20 ">Get more information</div>
    //                         </div>)
    //                     }

    //                     {
    //                         userData.chat_type === CONTACT_CHAT && !contactData.is_contact_validated && (<>
    //                             <div className="w-full flex flex-col items-center gap-7 bg-zinc-800 pt-8 pb-10 rounded-lg">
    //                                 <span>¿Do you know this user?</span>

    //                                 <button onClick={BlockingForNotKnowingTheUser} className="w-72 py-3 border-red-500 hover:bg-red-500 border-2 rounded-lg text-sm text-center ">Block This Contact</button>

    //                                 <button onClick={AddThisContact} className="w-72 py-3 border-zinc-200 hover:bg-zinc-200 border-2 rounded-lg text-sm text-center ">Add This Contact</button>
    //                             </div>
    //                         </>)
    //                     }


    //                     {
    //                         chatmessages.length > 0 ? (
    //                             <>{
    //                                 chatmessages.map((message: any) => {
    //                                     return (<>
    //                                         {message.message_type === 'text' && (
    //                                             <>
    //                                                 <Message key={message.message_id} message={message} />

    //                                             </>)
    //                                         }
    //                                         {message.message_type === 'unreadMessage' && (
    //                                             <>
    //                                                 <p id={message.notification_id} key={message.notification_id} className="mx-auto text-xs p-3 bg-zinc-900 rounded-xl">{`${numberOfUnreadMessages} unread messages`}</p>
    //                                             </>)
    //                                         }

    //                                         {message.message_type === 'unionDate' && (
    //                                             <>
    //                                                 <div id={message.message_id} key={message.message_id} className="w-full flex flex-col justify-center items-center mx-auto ">
    //                                                     <p className="mx-auto text-xs p-4 bg-zinc-900 rounded-xl">{`user ${message.username} joined the group`}</p>
    //                                                 </div>
    //                                             </>)
    //                                         }
    //                                         {message.message_type === 'emitionDate' && (
    //                                             <>
    //                                                 <div id={message.emition_id} key={message.emition_id} className="w-full flex flex-col justify-center items-center mx-auto   ">
    //                                                     <p className="mx-auto text-sm p-4 bg-zinc-900 rounded-xl">{message.emition_date}</p>
    //                                                 </div>
    //                                             </>)
    //                                         }
    //                                     </>
    //                                     )
    //                                 })
    //                             }</>)
    //                             :
    //                             (<div className="w-full h-full"></div>)


    //                     }
    //                     {/* este elemento es una interseccion que nos sirve para saber si el usuario se encuentra mierando los mensajes mas reciente o esta navegando por los mensajes antiguos*/}
    //                     <div className={`${userData.chat_type === CONTACT_CHAT || userData.chat_type === GROUP_CHAT ? '' : 'hidden'} relative w-full h-[0.5px]`}>
    //                         <div ref={recentMessagesArea} className="absolute w-full h-[190px] bottom-0 left-auto z-10"></div>
    //                     </div>
    //                 </div>
    //                 {/* bg-zinc-700 */}
    //                 <div className={`${userData.chat_type === CONTACT_CHAT || userData.chat_type === GROUP_CHAT ? '' : 'hidden'} absolute w-full h-[70px] left-0 bottom-0 z-10 flex flex-col py-[10px]  justify-center items-center bg-zinc-700 lg:relative`}>
    //                     <div className="relative w-full h-full flex flex-row justify-center items-center">
    //                         <div className="absolute bottom-[68px] right-3 w-28 flex flex-row justify-end items-end gap-4 z-10 md:right-20 md:bottom-[68px] ">
    //                             {userData.chat_id ?
    //                                 (<>
    //                                     <div className={`${!isUserInRecentMessagesArea && numberOfUnreadMessagesForIcon ? "" : "hidden"} w-11 h-11 flex flex-col justify-center items-center bg-blue-500 rounded-full font-medium`}>{!isUserInRecentMessagesArea && numberOfUnreadMessagesForIcon ? numberOfUnreadMessagesForIcon : ''}</div>
    //                                     <div className={`${userData.chat_id && isUserInRecentMessagesArea ? "hidden" : ""} w-14 h-14 flex flex-col justify-center items-center bg-zinc-950 rounded-full hover:bg-zinc-800`} onClick={DownToRecentMessageAreaHandler}>{(userData.chat_id && isUserInRecentMessagesArea) ? <></> : iconsForChatsPage[6].icon}</div>
    //                                 </>)
    //                                 :
    //                                 (<></>)
    //                             }
    //                         </div>
    //                         {/* bg-zinc-600 */}
    //                         <form onSubmit={userData.chat_type === GROUP_CHAT ? GroupMessageSendingHandle : ContactMessageSendingHandle} className={`${userData.chat_id ? "" : "hidden"} relative h-14 w-[95%] flex flex-row justify-between items-center pr-2 bg-zinc-600 rounded-md`}>
    //                             <input className="outline-none flex-1 bg-transparent text-xs p-3" type="text" placeholder="Type a message here" value={message} onChange={changeValueOfMessage} />
    //                             <button className="w-9 h-10 flex flex-col justify-center items-center bg-blue-500 rounded-lg">
    //                                 {iconsForChatsPage[2].icon}
    //                             </button>
    //                         </form>
    //                     </div>
    //                 </div>
    //             </div>


    //             {/* icon close */}
    //             <div className={`${isOpenAChat || menuOpen ? "" : "hidden"} absolute w-9 h-9 flex flex-col justify-center items-center top-[16px] right-[3px] z-20 md:top-[12px] md:right-[14px] sm:top-[16px] sm:right-[20px] md:hidden`} onClick={MenuCloseHandler} >
    //                 <div className={`relative w-7 h-8 flex flex-col justify-center items-center bg-zinc-950 rounded-xl text-white `}>
    //                     {iconsForChatsPage[4].icon}</div>
    //             </div>



    //             {/* ************** nos falta implementar estas cards  en la vista y despues empezar con el la logica*/}
    //             {/* card para crear o unirse a un chat grupal */}


    //             <div className={`${isOpenCardToSelectOptions || isOpenChannelCreationCard || isOpenJoinCardToChat || isOpenAddContactCard || wasNewIvitationIdCreated || isOpenCardToLeaveToGroup ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`} >

    //                 <div className={`${isOpenCardToSelectOptions ? "" : "hidden"} relative w-[90%] h-72 flex flex-col justify-center items-center gap-5 bg-zinc-950 rounded-xl text-white sm:w-80 md:w-80 `} >
    //                     <button onClick={OpenCardToCreateChannel} className="w-[65%] py-3 bg-blue-500 rounded-lg">Create New Channel</button>
    //                     <button onClick={OpenCardToJoinChannel} className="w-[65%] py-3 bg-blue-500 rounded-lg">Enter to a Channel</button>
    //                     <div className="w-7 h-1 bg-zinc-500 rounded-md " ></div>
    //                     <button onClick={OpenCardToAddContact} className="w-[65%] py-3 bg-green-500 rounded-lg">Add New Contact</button>
    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardToSelectOptions} >{iconsForChatsPage[4].icon}</div>
    //                 </div>



    //                 <div className={`${isOpenChannelCreationCard ? "" : "hidden"} relative w-[90%] h-[28.125rem] flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
    //                     <h3>New Channel</h3>
    //                     <form onSubmit={HandlerCreateNewChannel} ref={formToCreateChannel} className="w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%] ">
    //                         <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Channel name" id="channelName" name="channelName" />
    //                         <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Password Channel" id="channelPassword" name="channelPassword" />
    //                         <textarea className="outline-none w-full h-28 resize-none p-3 text-sm rounded-lg bg-zinc-700" name="channelDescription" id="channelDescription" placeholder="Channel Description"  ></textarea>
    //                         <input className="outline-none w-[60%] py-3 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32  md:self-end" type="button"
    //                             value="Save" onClick={HandlerCreateNewChannel} />
    //                     </form>
    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfCreateChannel} >{iconsForChatsPage[4].icon}</div>
    //                 </div>



    //                 <div className={`${wasNewIvitationIdCreated ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
    //                     <h3>Invitation id</h3>

    //                     <div className='w-[80%] h-14 self flex flex-row justify-between items-center bg-zinc-700 p-3 gap-5 rounded-xl' onClick={CopyInvitationId}>
    //                         <input ref={inputOfInvitationId}
    //                             id="invitationIdInput" type="text" className='w-full flex flex-col justify-center items-start   whitespace-nowrap overflow-hidden selection:bg-transparent bg-zinc-700  text-white outline-none caret-transparent select ' onClick={CopyInvitationId} defaultValue={invitationId} />

    //                         <div onClick={CopyInvitationId} className='flex flex-col justify-center items-center w-4 h-4'>{!isInvitationIdCopied ? iconsForChatsPage[8].icon : iconsForChatsPage[9].icon}</div>
    //                     </div>

    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfInvitationIdCreated} >{iconsForChatsPage[4].icon}</div>


    //                 </div>

    //                 <div className={`${isOpenJoinCardToChat ? "" : "hidden"} relative w-[90%] h-72 flex flex-col justify-center items-center gap-8  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
    //                     <h3>Join to a Channel</h3>
    //                     <form onSubmit={HandlerJoinToChannel} ref={formToJoinChannel} className="w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%]">
    //                         <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Insert Invitation Id" id="invitationId" name="invitationId" value={invitationId} onChange={(e) => setInvitationId(e.target.value)} />
    //                         <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Insert Password" id="channelPassword" name="channelPassword" />
    //                         <input className="outline-none w-[50%] py-2 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32" type="button" value="Join" readOnly onClick={HandlerJoinToChannel} />
    //                     </form>
    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfJoinToChannel} >{iconsForChatsPage[4].icon}</div>
    //                 </div>

    //                 <div className={`${isOpenAddContactCard ? "" : "hidden"} relative w-[90%] h-96  flex flex-col pt-16 items-center mb-20 gap-8  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
    //                     <h3>Add New Contact</h3>
    //                     <form onSubmit={RegisterNewContact} ref={formToCreateNewContact} className="relative w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%]">
    //                         <div className="w-full h-11 flex flex-row items-center gap-1 p-2 bg-zinc-600 rounded-md">
    //                             {iconsForChatsPage[1].icon}
    //                             <input className="w-full text-xs bg-transparent outline-none" type="text" value={searchNewContactValue} placeholder="Search" onChange={HandlerSearchNewContacts} />
    //                         </div>

    //                         {searchNewContactValue && listOfNewContactSearched.length > 0 && (<>
    //                             <div className="absolute top-12 w-full h-max-64 flex flex-col justify-start items-center gap-3 p-3 bg-zinc-950 rounded-md">
    //                                 <div className="w-full h-full flex flex-col justify-start items-center gap-3 p-3 overflow-scroll">
    //                                     {
    //                                         listOfNewContactSearched.map((contactFound): any => {
    //                                             return <div id={contactFound.user_id} key={contactFound.user_id}
    //                                                 className="w-full h-15 flex flex-row justify-start items-center gap-3 p-2 bg-zinc-600 rounded-md" onClick={SelectUserForToBeNewContact}>
    //                                                 <Image loading="eager" src={contactFound.profile_picture} id={contactFound.user_id} alt="ContactProfile" width="45" height="45" className="rounded-md" onClick={SelectUserForToBeNewContact} />
    //                                                 <p id={contactFound.user_id} onClick={SelectUserForToBeNewContact}>{contactFound.username}</p>
    //                                             </div>
    //                                         })
    //                                     }

    //                                 </div>

    //                                 <div className="px-4 py-2 flex flex-row bg-zinc-700 gap-2 rounded-md" >
    //                                     <div onClick={SearchContactsOnPreviousPage} className="bg-blue-600 rounded-md px-3 py-1" >{"<"}</div>
    //                                     <span className="w-5 text-center bg-transparent">{offsetToSearchNewContacts}</span>
    //                                     <div onClick={SearchContactsOnNextPage} className="bg-blue-600 rounded-md px-3 py-1">{">"}</div>
    //                                 </div>
    //                             </div>

    //                         </>
    //                         )
    //                         }


    //                         {searchNewContactValue && listOfNewContactSearched.length === 0 && (
    //                             <>
    //                                 <div className="absolute top-12 w-full h-max-64 flex flex-col justify-center items-center gap-3 p-3 bg-zinc-950 rounded-md">
    //                                     <div className="w-full h-full flex flex-col justify-center items-center gap-3 p-3 bg-red-500 rounded-lg">

    //                                         <span className="p-3 text-sm rounded-lg ">matches not found</span>

    //                                     </div>
    //                                 </div>
    //                             </>)
    //                         }


    //                         {userSelectedToBeNewContact.user_id ? (
    //                             <>
    //                                 <h4>User Selected</h4>
    //                                 <div className=" w-full h-15 flex flex-row justify-start items-center gap-3 p-2 bg-zinc-600 rounded-md">
    //                                     {/* <Image src={userSelectedToBeNewContact.profile_picture} alt="ContactProfile" width="45" height="45" className="rounded-md" /> */}
    //                                     <Image loading="eager" src={userSelectedToBeNewContact.profile_picture} alt="ContactProfile" width="45" height="45" className="rounded-md" />
    //                                     <p>{userSelectedToBeNewContact.username}</p>
    //                                     <div className="w-7 h-7 flex felx-col justify-center items-center ml-auto rounded-full bg-zinc-700 hover:bg-red-500" onClick={DeleteContactSelected}>
    //                                         {iconsForChatsPage[4].icon}
    //                                     </div>
    //                                 </div>

    //                             </>

    //                         ) : (
    //                             <></>
    //                         )
    //                         }


    //                         <button className="outline-none w-[50%] py-2 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32" onClick={RegisterNewContact}>Add Contact</button>


    //                     </form>

    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfAddContact} >{iconsForChatsPage[4].icon}</div>
    //                 </div>


    //                 <div className={`${isOpenCardToLeaveToGroup ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[40%] xl:w-[30%]`}>

    //                     <button onClick={LeaveTheGroup} className="w-[65%] py-3 bg-red-500 rounded-lg">Leave To Group</button>

    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseLeaveToGroupCard} >{iconsForChatsPage[4].icon}</div>

    //                 </div>


    //             </div>

    //             {/* <div className={`${isOpenCardToSelectOptions ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}> */}
    //             <div className={`${isOpenCardToChangeRoleOfMember && isUserAdminToGroup ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}>

    //                 <div className={`${isOpenCardToChangeRoleOfMember && isUserAdminToGroup ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>

    //                     <button onClick={DeleteMemberOfChat} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Member</button>

    //                     <button onClick={ConvertMemberToAdmin} className="w-[65%] py-3 bg-blue-500 rounded-lg">Change Member To Admin</button>

    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseCardOfChangeRoleOfMember} >{iconsForChatsPage[4].icon}</div>
    //                 </div>

    //             </div>


    //             <div className={`${isOpenSettingsOfContactChat && userData.chat_type === CONTACT_CHAT ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}>

    //                 <div className={`${isOpenSettingsOfContactChat && userData.chat_type === CONTACT_CHAT ? "" : "hidden"} relative w-[90%] h-64 flex flex-col justify-center items-center py-24 gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>

    //                     {/* <button onClick={DeleteMemberOfChat} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Member</button> */}

    //                     <button onClick={DeleteChatHistory} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Chat History</button>

    //                     <button onClick={contactData.is_blocked ? UnlockThisContact : BlockThisContact} className="w-[65%] py-3 bg-blue-500 rounded-lg">{contactData.is_blocked ? 'Unlock this Contact' : 'Block this Contact'}</button>

    //                     <button onClick={DeleteThisContact} className="w-[65%] py-3 bg-blue-500 rounded-lg">Delete This Contact</button>

    //                     <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={CloseSettingsOfContactChat} >{iconsForChatsPage[4].icon}</div>
    //                 </div>

    //             </div>


    //         </div >
    //     </div>
    // )

    // #endregion
}

export default ChatsContent