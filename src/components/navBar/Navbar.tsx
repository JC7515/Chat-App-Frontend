'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { userInfo } from '../infoUser/InfoUser'
import { logoForLogin } from '../logo/Logo.data'
import { iconsArrowForNav, infoForMenuProfile } from './NavBar.data'

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false)

    const openMenuHandler = () => {
        if (!menuOpen) {
            setMenuOpen(true)
        } else {
            setMenuOpen(false)
        }
    }


    return (
        <nav className='relative w-full h-20 flex flex-row items-center justify-between px-6 bg-zinc-50'>
            <div className='flex flex-row justify-center gap-1 '>
                {logoForLogin.icon}
                <h2 className='flex flex-col justify-center'>DevPros</h2>
            </div>
            <div className='flex flex-row gap-3' onClick={openMenuHandler} >
                <Image src={userInfo.profileImage} className='w-10 h-10 rounded-lg' alt='profileImage' />
                <p className=" hidden md:flex md:flex-col md:justify-center">{userInfo.name}</p>
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