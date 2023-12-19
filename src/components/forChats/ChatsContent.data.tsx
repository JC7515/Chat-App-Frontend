import { IoMdAdd } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { SlArrowLeft } from "react-icons/sl";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdGroup } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import myImage from '../../../public/myImage.jpg'


export const GROUP_MESSAGE_EVENT = 'groupMessage' 
export const CONTACT_MESSAGE_EVENT = 'contactMessage' 
export const NEW_GROUP_MEMBER_EVENT = 'newGroupMember' 
export const NOTIFICATION_MESSAGE_EVENT = 'notificationMessage' 
export const GET_USER_SOCKET_ID_EVENT = 'userSocketId' 
export const A_PARTICIPANT_JOINED_THE_CHAT_EVENT = 'aParticipantJoinedTheChat' 
export const A_PARTICIPANT_UNJOINED_TO_CHAT_EVENT = 'aParticipantUnjoinedToChat' 
export const AUTH_EVENT = 'auth' 




export const iconsForChatsPage = [
    { 
        id: '0',
        icon: <IoMdAdd /> ,
    },
    { 
        id: '1',
        icon: <IoMdSearch size="20" /> ,
    },
    { 
        id: '2',
        icon: <IoSend size="17"/> ,
    },
    { 
        id: '3',
        icon: <IoMenu size="23" /> ,
    },
    { 
        id: '4',
        icon: <IoCloseOutline size="22"/>,
    },
    { 
        id: '5',
        icon: <SlArrowLeft />,
    },
    { 
        id: '6',
        icon: <FaChevronDown />,
    },
    { 
        id: '7',
        icon: <FaUserTie size="14" color="white" />,
    },
    { 
        id: '8',
        icon: <MdOutlineContentCopy size="15" color="white" />,
    },
    { 
        id: '9',
        icon: <FaCheck size="15" color="white" />,
    },
    { 
        id: '10',
        icon: <MdDelete size="15" color="white" />,
    },
    
]

export const groupsChats = [
    { 
        id: '0',
        name: 'Front-end developers',
        icon: '',
        alias: 'FD'
    },
    { 
        id: '1',
        name: 'random',
        icon: '',
        alias: 'R'
    },
    { 
        id: '2',
        name: 'BACK-END',
        icon: '',
        alias: 'B'
    },
    { 
        id: '3',
        name: 'CATS AND DOGS',
        icon: '',
        alias: 'CA'
    },
    { 
        id: '4',
        name: 'Welcome',
        icon: '',
        alias: 'W'
    },
]



export const contactChats = [
    { 
        id: '0',
        name: 'Felipe Gutierrez Zopal',
        icon: '',
        alias: 'FG'
    },
    { 
        id: '1',
        name: 'Jose Manuel Pizzarro',
        icon: '',
        alias: 'JM'
    },
    { 
        id: '2',
        name: 'Ricardo Rojas',
        icon: '',
        alias: 'R'
    },
    { 
        id: '3',
        name: 'Joel Isidro Alvarado',
        icon: '',
        alias: 'J'
    },
    { 
        id: '4',
        name: 'Gian Luka Perez',
        icon: '',
        alias: 'G'
    },
]




export const chatMessages = [
    {
        user_id: '0',
        name: 'Nellie Francis',
        date: 'yesterday',
        hour: 'at 2:29 AM',
        message_content: 'Suspendisse enim tellus, elementum quis dictum sed, sodales at mauris 😀',
        profile_image: myImage,
    },
    {
        user_id: '1',
        name: 'Annaliese Huynh',
        date: 'yesterday',
        hour: 'at 2:29 AM',
        message_content: 'Orci varius natoque penatibus et magnis dis parturient montes 😀',
        profile_image: myImage,
    },
    {
        user_id: '2',
        name: 'Xanthe Neal',
        date: 'yesterday',
        hour: 'at 1:29 PM',
        message_content: 'Proin pretium id nunc eu molestie. Nam consectetur',
        profile_image: myImage,
    },
    {
        user_id: '3',
        name: 'Denzel Barrett',
        date: 'yesterday',
        hour: 'at 2:39 PM',
        message_content: 'Suspendisse enim tellus, elementum quis dictum sed, sodales at mauris 😀',
        profile_image: myImage,
    },
    {
        user_id: '4',
        name: 'Nellie Francis',
        date: 'today',
        hour: 'at 2:29 AM',
        message_content: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra 😀',
        profile_image: myImage,
    },
    {
        user_id: '5',
        name: 'Shaunna Firth',
        date: 'today',
        hour: 'at 1:29 PM',
        message_content: 'Morbi eget turpis ut massa luctus cursus. Sed sit amet risus quis neque condimentum aliquet. Phasellus consequat et justo eu accumsan 🙌. Proin pretium id nunc eu molestie. Nam consectetur, ligula vel mattis facilisis, ex mauris venenatis nulla, eget tempor enim neque eget massa 🤣',
        profile_image: myImage,
    },
    {
        user_id: '6',
        name: 'Denzel Barrett',
        date: 'today',
        hour: 'at 2:39 PM',
        message_content: 'Aenean tempus nibh vel est lobortis euismod. Vivamus laoreet viverra nunc 🐶',
        profile_image: myImage,
    },
]



export const groupData = {
    id: '01',
    groupName: 'Front-end developers',
    description: 'Pellentesque sagittis elit enim, sit amet ultrices tellus accumsan quis. In gravida mollis purus, at interdum arcu tempor non',
    members: [
        {
            userId: '0',
            name: 'Xanthe Neal',
            profileImage: myImage,
        },
        {
            userId: '1',
            name: 'Nellie Francis',
            profileImage: myImage,
        },
        {
            userId: '2',
            name: 'Denzel Barrett',
            profileImage: myImage,
        },
        {
            userId: '3',
            name: 'Shaunna Firth',
            profileImage: myImage,
        },
        {
            userId: '4',
            name: 'Felipe Gutierrez',
            profileImage: myImage,
        },
    ]
}


export const iconsArrowForNavMenuChats = [
    {
        id: "0",
        icon: <IoMdArrowDropup size="16"  color="white" />,
    },
    {
        id: "1",
        icon: <IoMdArrowDropdown size="16" color="white" />,
    },

]

export const infoForNavMenuChat = [
    {
        id: "0",
        name: 'My profile',
        icon: <RiAccountCircleFill size="23" />,
        class: 'w-full flex flex-row py-3 px-2 rounded-lg gap-3 hover:bg-zinc-700',
        link: '/profile'
    },
    {
        id: "1",
        name: 'Group Chat',
        icon: <MdGroup size="23" />,
        class: 'w-full flex flex-row py-3 px-2 rounded-lg gap-3 hover:bg-zinc-700',
        link: '/chats'
    },
    {
        id: "2",
        name: 'Logout',
        icon: <RiLogoutBoxRLine size="23" color="red " />,
        class: 'w-full flex flex-row px-3 pt-7 pb-3 rounded-lg rounded-t-none  gap-3 mt-3 border-zinc-400 border-t hover:bg-red-400',
        funtionLogOut: () => {}
    },
]
