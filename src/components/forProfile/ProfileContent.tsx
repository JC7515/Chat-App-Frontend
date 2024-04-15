'use client'
import { GetUserData } from "@/helpers"
import { updateUserData } from "@/redux/features/userDataSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { GetUserDataValidated } from "@/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { bodyUserData } from "../types"
import ProfileEditCard from "./subComponents/profileEditCard/ProfileEditCard"
import ProfileInfoCard from "./subComponents/profileInfoCard/ProfileInfoCard"


const ProfileContent = () => {



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


    const [profileEditOn, setProfileEditOn] = useState(false)

    const [wasSendEditForm, setWasSendEditForm] = useState(false)

    const userData = useAppSelector(state => state.userDataSlice.data)

    const dispatch = useAppDispatch()

    const ProfileEditOnHandler = (): void => {
        if (!profileEditOn) {
            setProfileEditOn(true)
        } else {
            setProfileEditOn(false)
        }
    }

    const WasSendEditForm = () => {
        setWasSendEditForm(true)
    }


    useEffect(() => {

        const UserDataFunc = async () => {
            try {
                const resp = await GetUserData()
                dispatch(updateUserData(resp))

                // console.log(resp)

            } catch (error) {
                // console.log(error)
                router.push('/')
            }
        }

        UserDataFunc()

    }, [wasSendEditForm])



    return (
        <>
            {!profileEditOn ?
                (
                    <>
                        <ProfileInfoCard ProfileEditOnHandler={ProfileEditOnHandler} userData={userData} WasSendEditFormFunc={WasSendEditForm} />
                    </>
                ) : (
                    <>
                        <ProfileEditCard ProfileEditOnHandler={ProfileEditOnHandler} userData={userData} WasSendEditFormFunc={WasSendEditForm} />
                    </>
                )
            }

        </>
    )


    // return (
    //     <>
    //         {!profileEditOn ? (<>
    //             <section className="w-full h-screen flex flex-col items-center mt-16 gap-14">
    //                 <div className="w-full flex flex-col items-center gap-4">
    //                     <h1 className="text-3xl font-normal" >Personal info</h1>
    //                     <h2 className="text-base ">Basic info, like your name and photo</h2>
    //                 </div>
    //                 <div className="w-full flex flex-col md:w-4/5  md:h-m-[580.54px] lg:w-[845.91px] md:border-zinc-200 md:border-2 md:rounded-2xl ">
    //                     <div className="w-full flex flex-row justify-between items-center px-5 gap-4 md:px-11 md:border-y md:pt-10 md:pb-8">
    //                         <div className="flex-1 max-w-[190px] md:max-w-[350px]">
    //                             <h2 className="text-3xl font-normal" >Profile</h2>
    //                             <p className="text-zinc-500 text-sm" >Some info may be visible to other people</p>
    //                         </div>
    //                         <div className=" h-12 flex flex-row justify-center items-center border-zinc-400 border-2 rounded-2xl px-10  hover:bg-zinc-200" onClick={ProfileEditOnHandler}>
    //                             <p className="text-zinc-500">Edit</p>
    //                         </div>
    //                     </div>

    //                     <div className="w-full h-min-[84px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8" >
    //                         <div className="min-w-[90px] md:w-48" >
    //                             <p className="text-zinc-400">PHOTO</p>
    //                         </div>
    //                         <div className="flex-1 flex flex-row justify-end md:justify-start  ">
    //                             <Image src={userInfo.profileImage} alt="profilePicture" width="90" height="90" className="rounded-xl" />
    //                         </div>
    //                     </div>

    //                     <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
    //                         <div className="min-w-[90px] md:w-48">
    //                             <p className="text-zinc-400">NAME</p>
    //                         </div>
    //                         <div className="flex-1 flex flex-row justify-end md:justify-start  ">
    //                             <p>{userInfo.name}</p>
    //                         </div>
    //                     </div>

    //                     <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
    //                         <div className="min-w-[90px] md:w-48">
    //                             <p className="text-zinc-400">BIO</p>
    //                         </div>
    //                         <div className="flex-1 flex flex-row justify-end md:justify-start  ">
    //                             <p>{userInfo.bio}</p>
    //                         </div>
    //                     </div>

    //                     <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
    //                         <div className="min-w-[90px] md:w-48">
    //                             <p className="text-zinc-400">PHONE</p>
    //                         </div>
    //                         <div className="flex-1 flex flex-row justify-end md:justify-start  ">
    //                             <p>{userInfo.phone}</p>
    //                         </div>
    //                     </div>

    //                     <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
    //                         <div className="min-w-[90px] md:w-48">
    //                             <p className="text-zinc-400">EMAIL</p>
    //                         </div>
    //                         <div className="flex-1 flex flex-row justify-end md:justify-start  ">
    //                             <p>{userInfo.email}</p>
    //                         </div>
    //                     </div>

    //                     <div className="w-full h-[109px] flex flex-row justify-between items-center gap-5 py-8 px-5 border-b border-zinc-300 md:px-11 md:border-y md:py-3  md:gap-8">
    //                         <div className="min-w-[90px] md:w-48">
    //                             <p className="text-zinc-400">PASSWORD</p>
    //                         </div>
    //                         <div className="flex-1 flex flex-row justify-end md:justify-start  ">
    //                             <p>{userInfo.password}</p>
    //                         </div>
    //                     </div>

    //                 </div>

    //                 <div>
    //                     <p>created by JuanProDev</p>
    //                 </div>
    //             </section>
    //         </>
    //         ) : (


    //             <>
    //                 <section className="w-full h-screen flex flex-col items-center mt-16 gap-7 px-6 " >

    //                     <div className="w-full flex flex-col items-start gap-10 py-10 md:w-4/5 md:h-min-[580.54px] lg:w-max-[845.91px]">

    //                         <div className="w-20 flex flex-row justify-start items-center gap-1" onClick={ProfileEditOnHandler}>
    //                             {iconsForProfile[0].icon}
    //                             <span className="text-blue-500" >Back</span>
    //                         </div>

    //                         <div className="w-full flex flex-col items-start gap-10 py-10 md:pt-7 md:pb-11 md:px-12 md:border-zinc-200 md:border-2 md:rounded-2xl" >
    //                             <div className="flex flex-col gap-1 md:w-[416.93px]">
    //                                 <h1 className="text-2xl">Change Info</h1>
    //                                 <p className="text-zinc-500">Changes will be reflected to every services</p>
    //                             </div>

    //                             <form action="" className="w-full flex flex-col items-start gap-6 md:w-3/4 lg:w-[416.93px]">
    //                                 <div className="w-full flex flex-row items-center gap-5">
    //                                     <label htmlFor="file" className="flex flex-row relative ">
    //                                         <input className="hidden" type="file" alt="file" id="file" />
    //                                         <Image src={userInfo.profileImage} alt='editProfileImage' width="90" height="90" className="rounded-xl " />
    //                                         {iconsForProfile[1].icon}
    //                                     </label>
    //                                     <label htmlFor="file" className="text-zinc-500" >CHANGE PHOTO</label>
    //                                 </div>

    //                                 <div className=" w-full flex flex-col gap-3">
    //                                     <label htmlFor="Name">Name</label>
    //                                     <input className="w-full border-zinc-400 border-2 rounded-lg p-3" type="text" name="Name" id="" placeholder="Enter your name..." />
    //                                 </div>

    //                                 <div className=" w-full flex flex-col gap-3">
    //                                     <label htmlFor="Bio">Bio</label>
    //                                     <textarea className="w-full h-28 resize-none border-zinc-400 border-2 rounded-lg p-3" name="Bio" id="" placeholder="Enter your bio..." ></textarea>
    //                                 </div>

    //                                 <div className=" w-full flex flex-col gap-3">
    //                                     <label htmlFor="Phone">Phone</label>
    //                                     <input className="w-full border-zinc-400 border-2 rounded-lg p-3" type="text" name="Phone" id="" placeholder="Enter your phone..." />
    //                                 </div>

    //                                 <div className=" w-full flex flex-col gap-3">
    //                                     <label htmlFor="Email">Email</label>
    //                                     <input className=" w-full border-zinc-400 border-2 rounded-lg p-3" type="email" name="Email" id="" placeholder="Enter your email..." />
    //                                 </div>

    //                                 <div className=" w-full flex flex-col gap-3">
    //                                     <label htmlFor="Password">Password</label>
    //                                     <input className=" w-full border-zinc-400 border-2 rounded-lg p-3" type="password" name="Password" id="" placeholder="Enter your new password..." />
    //                                 </div>

    //                                 <button className="bg-blue-500 border-2 rounded-lg px-6 py-2 text-white">Save</button>
    //                             </form>

    //                         </div>

    //                     </div>

    //                 </section>
    //             </>
    //         )
    //         }
    //     </>

    // )
}


export default ProfileContent



