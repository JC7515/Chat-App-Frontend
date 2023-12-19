import { userInfo } from "@/components/infoUser/InfoUser"
import Image from "next/image"
import { iconsForProfile } from "../../ProfileContent.data"
import { propsToProfile } from "../../../types"




const ProfileEditCard: React.FC<propsToProfile> = ({ProfileEditOnHandler})  => {
    return (
        <section className="w-full h-screen flex flex-col items-center mt-16 gap-7 px-6 " >

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

                    <form action="" className="w-full flex flex-col items-start gap-6 md:w-3/4 lg:w-[416.93px]">
                        <div className="w-full flex flex-row items-center gap-5">
                            <label htmlFor="file" className="flex flex-row relative ">
                                <input className="hidden" type="file" alt="file" id="file" />
                                <Image src={userInfo.profileImage} alt='editProfileImage' width="90" height="90" className="rounded-xl " />
                                {iconsForProfile[1].icon}
                            </label>
                            <label htmlFor="file" className="text-zinc-500" >CHANGE PHOTO</label>
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="Name">Name</label>
                            <input className="w-full border-zinc-400 border-2 rounded-lg p-3" type="text" name="Name" id="" placeholder="Enter your name..." />
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="Bio">Bio</label>
                            <textarea className="w-full h-28 resize-none border-zinc-400 border-2 rounded-lg p-3" name="Bio" id="" placeholder="Enter your bio..." ></textarea>
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="Phone">Phone</label>
                            <input className="w-full border-zinc-400 border-2 rounded-lg p-3" type="text" name="Phone" id="" placeholder="Enter your phone..." />
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="Email">Email</label>
                            <input className=" w-full border-zinc-400 border-2 rounded-lg p-3" type="email" name="Email" id="" placeholder="Enter your email..." />
                        </div>

                        <div className=" w-full flex flex-col gap-3">
                            <label htmlFor="Password">Password</label>
                            <input className=" w-full border-zinc-400 border-2 rounded-lg p-3" type="password" name="Password" id="" placeholder="Enter your new password..." />
                        </div>

                        <button className="bg-blue-500 border-2 rounded-lg px-6 py-2 text-white">Save</button>
                    </form>

                </div>

            </div>

        </section>
    )
}

export default ProfileEditCard