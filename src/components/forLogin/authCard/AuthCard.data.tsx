import { RiFacebookBoxFill,  RiGoogleLine, RiTwitterFill, RiGithubFill, RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { bodyCookieOptions } from "@/components/types";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";


const cookieExpirationDate = new Date()

cookieExpirationDate.setDate(cookieExpirationDate.getDate() + 1)

export const ACCESS_TOKEN_NAME = 'access_token' 
export const REFRESH_TOKEN_NAME = 'refresh_token'
export const COOKIE_PATH = '/'
export const COOKIE_SECURE = false
export const COOKIE_HTTPONLY = false
export const COOKIE_EXPIRES = cookieExpirationDate

export const COOKIE_OPTIONS: bodyCookieOptions = {
    secure: COOKIE_SECURE, //secure: false indica que las cookies también se enviarán a través de conexiones HTTP no seguras. Para una mayor seguridad, deberías establecer secure: true 
    httpOnly: COOKIE_HTTPONLY, //httpOnly: false significa que la cookie es accesible a través de JavaScript en el cliente,Para una mayor seguridad, deberías establecer httpOnly: true 
    path: COOKIE_PATH, // si se establece como '/', la cookie estará disponible para todas las rutas del dominio
    expires: COOKIE_EXPIRES // Fecha de expiracion de la cookie
  }


const sizeOFIconsAuth0 = "25"
const colorOFIconsAuth0 = "rgb(209 213 219)"

const settingsOfIconsAuth0 = {
    size: "25",
    color: "#828282"
}

export const iconsAuth0 = [
    {   id: "0",
        icon: <RiGoogleLine size={settingsOfIconsAuth0.size} color={settingsOfIconsAuth0.color} className='hover:fill-black' />
    },
    {   id: "1",
        icon: <RiFacebookBoxFill size={settingsOfIconsAuth0.size} color={settingsOfIconsAuth0.color} className='hover:fill-black' />
    },
    {   id: "2",
        icon: <RiTwitterFill size={settingsOfIconsAuth0.size} color={settingsOfIconsAuth0.color} className='hover:fill-black' />
    },
    {   id: "3",
        icon: <RiGithubFill size={settingsOfIconsAuth0.size} color={settingsOfIconsAuth0.color} className='hover:fill-black' />
    },
    
]

const settingsOfIconsWithFrom = {
    size: "25",
    color: "#828282"
}

export const iconsForLogin = [
    {
        id: "0",
        icon: <MdEmail size={settingsOfIconsWithFrom.size} color={settingsOfIconsWithFrom.color} />
    },
    {
        id: "1",
        icon: <RiLockPasswordFill size={settingsOfIconsWithFrom.size} color={settingsOfIconsWithFrom.color} />
    },
    {
        id: "2",
        icon: <VscEye  size={settingsOfIconsWithFrom.size} color={settingsOfIconsWithFrom.color} />
    },   
    {
        id: "3",
        icon: <VscEyeClosed  size={settingsOfIconsWithFrom.size} color={settingsOfIconsWithFrom.color} />
    }   
]