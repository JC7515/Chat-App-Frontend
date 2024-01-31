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
import { IoMdSettings } from "react-icons/io";
import { CgBlock } from "react-icons/cg";
import { BiCheckDouble } from "react-icons/bi";
import { IoCheckmarkSharp } from "react-icons/io5";
import { HiChatAlt2 } from "react-icons/hi";
import myImage from '../../../public/myImage.jpg'
import { Toaster, toast } from 'react-hot-toast';
import { Content } from "next/font/google";
import { infoForNavMenuChatBody } from "../types";



export const IS_CONTACT_IN_THE_RECENT_MESSAGES_AREA_EVENT = 'isThe ContactInTheRecentMessagesArea' 
export const UNLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT = 'unlockExecutedByUserToContact' 
export const BLOCK_EXECUTED_BY_USER_TO_CONTACT_EVENT = 'blockExecutedByUserToContact' 
export const USER_IS_ONLINE_EVENT = 'userIsOnline'
export const USER_CLOSE_PAGE_EVENT = 'userClosePage'
export const GROUP_MESSAGE_EVENT = 'groupMessage'
export const CONTACT_MESSAGE_EVENT = 'contactMessage'
export const GROUP_CHAT = 'group'
export const CONTACT_CHAT = 'contact'
export const NEW_GROUP_MEMBER_EVENT = 'newGroupMember'
export const GROUP_NOTIFICATION_MESSAGE_EVENT = 'groupNotificationMessage'
export const CONTACT_NOTIFICATION_MESSAGE_EVENT = 'contactNotificationMessage'
export const GET_USER_SOCKET_ID_EVENT = 'userSocketId'

// *******************************************
export const A_PARTICIPANT_JOINED_THE_GROUP_CHAT_EVENT = 'aParticipantJoinedTheGroupChat'
export const A_PARTICIPANT_UNJOINED_TO_GROUP_CHAT_EVENT = 'aParticipantUnjoinedToGroupChat'
export const A_PARTICIPANT_JOINED_THE_CONTACT_CHAT_EVENT = 'aParticipantJoinedTheContactChat'
export const A_PARTICIPANT_UNJOINED_TO_CONTACT_CHAT_EVENT = 
'aParticipantUnjoinedToContactChat'
// *******************************************

export const A_PARTICIPANT_CHANGED_TO_ROLE_EVENT = 'aParticipantChangedToRoleChat'
export const A_PARTICIPANT_DELETED_BY_ADMIN_CHAT_EVENT = 'aParticipantDeletedByAdminToChat'
export const A_ADMIN_HAS_DELETED_YOU_CHAT_EVENT = 'aAdminHasDeletedYouToChat'
export const A_PARTICIPANT_LEFT_THE_GROUP_CHAT_EVENT = 'aParticipantLeftTheGroupChat'
export const AUTH_EVENT = 'auth'




export const SuccessToast = (message: string, positionToast: any) => toast.success(message, { position: positionToast })
export const ErrorToast = (message: string, positionToast: any) => toast.error(message, { position: positionToast })
export const LoadingToast = (message: string, positionToast: any) => toast.loading(message, { position: positionToast })

export const NotificationToast = (NotificationContent: string, NotificationUserName: string, profile_picture: string) => toast.custom((t) => (
    <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
    >
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <img
                        className="h-10 w-10 rounded-full"
                        src={profile_picture}
                        alt="Notification Profile Picture"
                    />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        {NotificationUserName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {NotificationContent}
                    </p>
                </div>
            </div>
        </div>
        <div className="flex border-l border-gray-200">
            <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Close
            </button>
        </div>
    </div>
    ))

export const UserJoinedToGroupToast = (NotificationUserName: string, profile_picture: string, GroupName: string) => toast.custom((t) => (
    <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <img
                        className="h-10 w-10 rounded-full"
                        src={profile_picture}
                        alt="Notification Profile Picture"
                    />
                </div>
                <div className="ml-3 flex-1 flex flex-col justify-center items-start">
                    <p className="text-sm font-medium text-gray-900">
                        {NotificationUserName} is joined to group {GroupName} 
                    </p>
                </div>
            </div>
        </div>
        <div className="flex border-l border-gray-200">
            <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Close
            </button>
        </div>
    </div>
    ))


export const ToastPromise = (myPromise: any) => toast.promise(
    myPromise,
    {
      loading: 'Creating Group',
      success: 'New Group Created',
      error: 'Group creation failed',
    },
    {
      style: {
        minWidth: '250px',
      },
      success: {
        duration: 3000,
        icon: '✅',
      },
      error: {
        duration: 3000,
        icon: '❌',
      }
    }
  );    


export const iconsPageLogo = [
    {
        id: '0',
        icon: <HiChatAlt2 size="80" color="white" className="animate-pulse"/>,
    },
    {
        id: '1',
        icon: <HiChatAlt2 size="120" color="white" />,
    },
]

export const iconsForChatsPage = [
    {
        id: '0',
        icon: <IoMdAdd />,
    },
    {
        id: '1',
        icon: <IoMdSearch size="20" />,
    },
    {
        id: '2',
        icon: <IoSend size="17" />,
    },
    {
        id: '3',
        icon: <IoMenu size="23" />,
    },
    {
        id: '4',
        icon: <IoCloseOutline size="22" />,
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
    {
        id: '11',
        icon: <IoMdSettings size="15" color="white" />,
    },
    {
        id: '12',
        icon: <CgBlock  size="22" color="red" />,
    },

]



export const iconsForMessages = [
    {
        id: '0',
        icon: <IoCheckmarkSharp  size="14" color="rgb(161 161 170)" />,
    },
    {
        id: '1',
        icon: <BiCheckDouble  size="14" color="rgb(96 165 250)" />,
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
        icon: <IoMdArrowDropup size="16" color="white" />,
    },
    {
        id: "1",
        icon: <IoMdArrowDropdown size="16" color="white" />,
    },

]

export const infoForNavMenuChat: infoForNavMenuChatBody[] = [
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
        link: '',
        funtionLogOut: () => {}
    },
]
