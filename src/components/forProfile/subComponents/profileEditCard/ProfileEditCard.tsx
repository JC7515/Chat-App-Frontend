import { userInfo } from "@/components/infoUser/InfoUser"
import Image from "next/image"
import { iconsForProfile } from "../../ProfileContent.data"
import { propsToProfile } from "../../../types"
import { GetCookieValue } from "@/helpers"
import { ACCESS_TOKEN_NAME } from "@/components/forLogin/authCard/AuthCard.data"
import { useRef, useState } from 'react'



const ProfileEditCard: React.FC<propsToProfile> = ({ProfileEditOnHandler, userData, WasSendEditFormFunc}: any)  => {
  

    const editForm: any = useRef()
   

    const HandleChangeUserInfo = async (e: any) => {
        try {
            e.preventDefault()

            const accessToken = GetCookieValue(ACCESS_TOKEN_NAME)

            const formData = new FormData(editForm.current)
                // console.log(formData.get('profilePicture'))
                // console.log(formData.get('bio'))
                // profilePicture: formData.get('profilePicture'),
                // userName: formData.get('userName'),
                // bio: formData.get('bio'),
                // phone: formData.get('phone'),
                // email: formData.get('email'),
                // password: formData.get('password'),

            // console.log(formData)

            const url = `${process.env.NEXT_PUBLIC_API_URL_DEV}/v1/profile`

            const resp = await fetch(url, {
                method: 'PUT',
                body: formData,
                headers: {
                    'authorization': `Bearer ${accessToken}`,
                    // 'Content-Type': 'multipart/form-data'
                }
            })

            const data = await resp.json()
             
            

            if (data.status === "FAILED") {
                // si falla la peticion devolveremos el valor de data.data que ese error.message
                throw data.data.error // { error: { message: 'error...'} }
            }

            WasSendEditFormFunc()
            ProfileEditOnHandler()

        } catch (error) {
            console.log(error)
            // aqui agregaremos logica de notificaciones toast
        }
    }

     



    return (
        <section className="w-full h-screen flex flex-col items-center mt-16 gap-7 px-6 bg-white " >

            <div className="w-full flex flex-col items-start gap-10 py-10 md:w-4/5 md:h-min-[580.54px] lg:w-max-[845.91px]">

                <div className="w-20 flex flex-row justify-start items-center gap-1" onClick={ProfileEditOnHandler}>
                    {iconsForProfile[0].icon}
                    <span className="text-blue-500" >Back</span>
                </div>

                <div className="w-full flex flex-col items-start gap-10 py-10 md:pt-7 md:pb-11 md:px-12 md:border-zinc-200 md:border-2 md:rounded-2xl" >
                    <div className="flex flex-col gap-1 md:w-[416.93px]">
                        <h1 className="text-2xl">Change Info</h1>
                        <p className="text-zinc-500">Changes will be reflected to every services</p>
                    </div>

                    <form ref={editForm} className="w-full flex flex-col items-start gap-6 md:w-3/4 lg:w-[416.93px]">
                        <div className="w-full flex flex-row items-center gap-5">
                            <label htmlFor="profilePicture" className="flex flex-row relative ">
                                <input className="hidden" type="file" alt="Profile Picture" name="profilePicture" id="profilePicture" />
                                <Image src={userData.profile_picture} alt='editProfileImage' width="90" height="90" className="rounded-xl " />
                                {iconsForProfile[1].icon}
                            </label>
                            <label htmlFor="profilePicture" className="text-zinc-500" >CHANGE PHOTO</label>
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="userName">Name</label>
                            <input className="w-full border-zinc-400 border-2 rounded-lg p-3" type="text" name="userName" id="userName" placeholder="Enter your userName..." />
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="bio">Bio</label>
                            <textarea className="w-full h-28 resize-none border-zinc-400 border-2 rounded-lg p-3" name="bio" id="bio" placeholder="Enter your bio..." ></textarea>
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="phone">Phone</label>
                            <input className="w-full border-zinc-400 border-2 rounded-lg p-3" type="text" name="phone" id="phone" placeholder="Enter your phone..." />
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="email">Email</label>
                            <input className=" w-full border-zinc-400 border-2 rounded-lg p-3" type="email" name="email" id="email" placeholder="Enter your email..." />
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="password">Password</label>
                            <input className=" w-full border-zinc-400 border-2 rounded-lg p-3" type="password" name="password" id="password" placeholder="Enter your new password..." />
                        </div>

                        <button className="bg-blue-500 border-2 rounded-lg px-6 py-2 text-white" onClick={HandleChangeUserInfo}>Save</button>
                    </form>

                </div>

            </div>

        </section>
    )
}

export default ProfileEditCard