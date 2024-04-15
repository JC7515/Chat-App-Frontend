'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { userInfo } from '../infoUser/InfoUser'
import { logoForLogin, LOGO_TITLE } from '../logo/Logo.data'
import { iconsArrowForNav, infoForMenuProfile } from './NavBar.data'
import { bodyUserData } from '../types'
import lockImage from '../../../public/lockImage.png'
import { GetUserData, LogicToLimitAmountOfToastOnScreen, LogOutUser } from '@/helpers'
import { ErrorToast, LoadingToast, LOG_OUT_FAILURE_ERROR_MESSAGE } from '../forChats/ChatsContent.data'
import { toast, useToasterStore } from 'react-hot-toast'

const Navbar = () => {

    const userDataBody: bodyUserData = {
        user_id: '...',
        username: '...',
        name: '...',
        biography: '...',
        phone: '...',
        email: '...',
        profile_picture: '',
        create_at: new Date(),
        chat_id: '..',
        chat_type: '..'
    }

    const router = useRouter()

    const [menuOpen, setMenuOpen] = useState(false)
    const [userData, setUserData] = useState<bodyUserData>(userDataBody)

    const { toasts } = useToasterStore()


    const openMenuHandler = () => {
        if (!menuOpen) {
            setMenuOpen(true)
        } else {
            setMenuOpen(false)
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
        const TOAST_LIMIT = 2

        LogicToLimitAmountOfToastOnScreen(toasts, TOAST_LIMIT, toast)

    }, [toasts])



    useEffect(() => {
        try {
            const UserDataFunc = async () => {
                const resp: any = await GetUserData()
                setUserData(resp)

                // console.log(resp)
            }

            UserDataFunc()

        } catch (err) {
            console.log(err)
            router.push('/')
        }
    }, [])

    return (
        <nav className='relative w-full h-20 flex flex-row items-center justify-between px-6 bg-zinc-50'>
            <div className='flex flex-row justify-center gap-1 '>
                {logoForLogin.icon}
                <h2 className='flex flex-col justify-center text-black'>{LOGO_TITLE}</h2>
            </div>
            <button className='flex flex-row items-center gap-3' onClick={openMenuHandler} data-testid="buttonToOpenOptionsList" >
                <p className=" hidden md:flex md:flex-col md:justify-center text-black">{userData.username}</p>
                {userData.profile_picture && (<>
                    <Image src={!userData.profile_picture ? lockImage : userData.profile_picture} className='rounded-lg' width="40" height="40" alt='profileImage' />
                </>)
                }
                {!userData.profile_picture && (<>
                    <div className="animate-pulse w-52 h-10 rounded-xl bg-zinc-200"></div>
                </>)
                }
                <div className="hidden md:flex md:flex-col md:justify-center md:items-center">{

                    menuOpen ? (iconsArrowForNav[1].icon) : (iconsArrowForNav[0].icon)

                }</div>

            </button>
            {
                menuOpen &&
                <ul className='w-56 absolute top-24 right-5 flex flex-col justify-between items-center gap-1 border-zinc-300 border-2 rounded-xl p-4 bg-white' data-testid="navBarListOptions" >
                    {
                        infoForMenuProfile.map((elem) => {
                            return elem.funtion === 'logOut' ?
                                <li onClick={LogOutHandler} key={elem.id} className={elem.class}>{elem.icon}<span onClick={LogOutHandler}>{elem.name}</span></li>
                                :
                                <Link href={elem.link} className='w-full' ><li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li></Link>
                        })
                    }
                </ul>
            }
        </nav>
    )
}

export default Navbar