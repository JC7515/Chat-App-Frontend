'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { GetUserData } from '../forProfile/subComponents/profileInfoCard/ProfileInfoCard.data'
import { useRouter } from "next/navigation"
import { userInfo } from '../infoUser/InfoUser'
import { logoForLogin } from '../logo/Logo.data'
import { iconsArrowForNav, infoForMenuProfile } from './NavBar.data'
import { bodyUserData } from '../types'

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


    const openMenuHandler = () => {
        if (!menuOpen) {
            setMenuOpen(true)
        } else {
            setMenuOpen(false)
        }
    }


    useEffect(() => {
        try {
            const UserDataFunc = async () => {
                const resp: any = await GetUserData(router)
                setUserData(resp)

                console.log(resp)
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
                <h2 className='flex flex-col justify-center'>DevPros</h2>
            </div>
            <div className='flex flex-row gap-3' onClick={openMenuHandler} >
                {!userData.profile_picture ? (<>
                    <div className="animate-pulse w-52 h-10 rounded-xl bg-zinc-200"></div>
                </>) : (<>
                    <Image src={userData.profile_picture} className='rounded-lg' width="40" height="40" alt='profileImage' />
                    <p className=" hidden md:flex md:flex-col md:justify-center">{userData.username}</p>
                </>)
                }
                <div className=" hidden md:flex md:flex-col md:justify-center md:items-center">{

                    menuOpen ? (iconsArrowForNav[1].icon) : (iconsArrowForNav[0].icon)

                }</div>

            </div>
            {
                menuOpen &&
                <ul className='w-56 absolute top-24 right-5 flex flex-col justify-between items-center gap-1 border-zinc-300 border-2 rounded-xl p-4 bg-white' >
                    {
                        infoForMenuProfile.map((elem) => {
                            return elem.funtionLogOut ?
                                <li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li>
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