import { RiAccountCircleFill } from "react-icons/ri";
import { MdGroup } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";


export const infoForMenuProfile = [
    {
        id: "0",
        name: 'My profile',
        icon: <RiAccountCircleFill size="23" color="black" />,
        class: 'w-full text-black flex flex-row py-3 px-2 rounded-lg gap-3 hover:bg-zinc-100',
        link: '/profile'
    },
    {
        id: "1",
        name: 'Group Chat',
        icon: <MdGroup size="23" color="black" />,
        class: 'w-full text-black flex flex-row py-3 px-2 rounded-lg gap-3 hover:bg-zinc-100',
        link: '/chats'
    },
    {
        id: "2",
        name: 'Logout',
        icon: <RiLogoutBoxRLine size="23" color="red" />,
        class: 'w-full flex flex-row px-3 pt-7 pb-3 rounded-lg rounded-t-none  gap-3 mt-3 text-black border-zinc-400 border-t hover:bg-red-100',
        link: '',
        funtion: 'logOut'
    },
]






export const iconsArrowForNav = [
    {
        id: "0",
        icon: <IoMdArrowDropup size="16" />,
    },
    {
        id: "1",
        icon: <IoMdArrowDropdown size="16" />,
    },

]
