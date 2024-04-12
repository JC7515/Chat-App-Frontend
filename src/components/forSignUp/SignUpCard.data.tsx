import { FaUserLarge } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaBirthdayCake } from "react-icons/fa";
import { IoMdPhonePortrait } from "react-icons/io";

const settingsOfIconsForSignUp = {
    size: "25",
    color: "#828282"
}

export const iconsForSignUp = [
    {
        id: "0",
        icon: <MdEmail size={settingsOfIconsForSignUp.size} color={settingsOfIconsForSignUp.color} />
    },
    {
        id: "1",
        icon: <RiLockPasswordFill size={settingsOfIconsForSignUp.size} color={settingsOfIconsForSignUp.color} />
    },
    {
        id: "2",
        icon: <FaUserLarge size={settingsOfIconsForSignUp.size} color={settingsOfIconsForSignUp.color} />
    },
    {
        id: "3",
        icon: <FaBirthdayCake size={settingsOfIconsForSignUp.size} color={settingsOfIconsForSignUp.color} />
    },
    {
        id: "4",
        icon: <IoMdPhonePortrait size={settingsOfIconsForSignUp.size} color={settingsOfIconsForSignUp.color} />
    },

]