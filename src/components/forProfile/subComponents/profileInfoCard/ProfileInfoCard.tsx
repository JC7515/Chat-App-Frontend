import { userInfo } from "@/components/infoUser/InfoUser"
import { LIST_BUTOMS, propsToProfile } from "@/components/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Este codigo es de ejemplo y no tiene que se tomado en cuenta dentro de la logica de este componente, lo que estamos haciendo con este codigo typeof LIST_BUTOMS[keyof typeof LIST_BUTOMS], es poder extraer los valores de todas las propiedades del objeto LIST_BUTOMS de forma utomatica, evitando ponerlo de esta forma "Profile" | "Chat" | "Task", que hace que cuando queramos agregar mas propiedades al objeto en cuestion tengamos que tambien agregale a mano otro valor mas a este grupo de types "Profile" | "Chat" | "Task", este truco nos lo enseño el profe midu y es para objetener ese valores de la propiedades del objeto de forma automatica, y si agregamos mas propiedades al objeto, este codigo typeof LIST_BUTOMS[keyof typeof LIST_BUTOMS] actualizara y agregara automaticamente todas la propiedades recien agregadas.
interface exampleOfButtonsOFTypesFile {
    Buttons: typeof LIST_BUTOMS[keyof typeof LIST_BUTOMS]
}



const ProfileInfoCard: React.FC<propsToProfile> = ({ ProfileEditOnHandler, userData, WasSendEditFormFunc}) => {

    return (
        <section className="w-full h-screen flex flex-col items-center mt-16 gap-14 bg-white">
            <div className="w-full flex flex-col items-center gap-4">
                <h1 className="text-3xl font-normal text-black" >Personal info</h1>
                <h2 className="text-base text-black">Basic info, like your name and photo</h2>
            </div>
            <div className="w-full flex flex-col md:w-4/5  md:h-m-[580.54px] lg:w-[845.91px] md:border-zinc-200 md:border-2 md:rounded-2xl ">
                <div className="w-full flex flex-row justify-between items-center px-5 gap-4 md:px-11 md:border-y md:pt-10 md:pb-8">
                    <div className="flex-1 max-w-[190px] md:max-w-[350px]">
                        <h2 className="text-3xl font-normal text-black" >Profile</h2>
                        <p className="text-zinc-500 text-sm" >Some info may be visible to other people</p>
                    </div>
                    <button className=" h-12 flex flex-row justify-center items-center border-zinc-400 border-2 rounded-2xl px-10  hover:bg-zinc-200" onClick={ProfileEditOnHandler}>
                        <p className="text-zinc-500">Edit</p>
                    </button>
                </div>


                {/* **************Datos de Usuario************  */}
                <div className="w-full h-min-[84px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8" >
                    <div className="min-w-[90px] md:w-48" >
                        <p className="text-zinc-400">PHOTO</p>
                    </div>
                    <div className="flex-1 flex flex-row justify-end md:justify-start  ">
                        {!userData.profile_picture ? (<>
                             <div className="animate-pulse w-[90px] h-[90px] rounded-xl bg-zinc-200"></div>
                        </>) : (<>
                            <Image className="rounded-xl" width="90" height="90" src={userData.profile_picture} alt="profilePicture" />
                        </>)
                        }
                    </div>
                </div>

                <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
                    <div className="min-w-[90px] md:w-48">
                        <p className="text-zinc-400">NAME</p>
                    </div>
                    <div className="flex-1 flex flex-row justify-end md:justify-start  ">
                        <p className="text-black">{userData.name}</p>
                    </div>
                </div>

                <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
                    <div className="min-w-[90px] md:w-48">
                        <p className="text-zinc-400">USERNAME</p>
                    </div>
                    <div className="flex-1 flex flex-row justify-end md:justify-start  ">
                        <p className="text-black">{userData.username}</p>
                    </div>
                </div>

                <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
                    <div className="min-w-[90px] md:w-48">
                        <p className="text-zinc-400">BIO</p>
                    </div>
                    <div className="flex-1 flex flex-row justify-end md:justify-start  ">
                        <p className="text-black" >{userData.biography}</p>
                    </div>
                </div>

                <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
                    <div className="min-w-[90px] md:w-48">
                        <p className="text-zinc-400">PHONE</p>
                    </div>
                    <div className="flex-1 flex flex-row justify-end md:justify-start  ">
                        <p className="text-black">{userData.phone}</p>
                    </div>
                </div>

                <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
                    <div className="min-w-[90px] md:w-48">
                        <p className="text-zinc-400">EMAIL</p>
                    </div>
                    <div className="flex-1 flex flex-row justify-end md:justify-start  ">
                        <p className="text-black">{userData.email}</p>
                    </div>
                </div>

                <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
                    <div className="min-w-[90px] md:w-48">
                        <p className="text-zinc-400">PASSWORD</p>
                    </div>
                    <div className="flex-1 flex flex-row justify-end md:justify-start  ">
                        <p className="text-black">************</p>
                    </div>
                </div>

            </div>

            <div>
                <p className="text-black">created by JuanProDev</p>
            </div>
        </section>
    )
}

export default ProfileInfoCard