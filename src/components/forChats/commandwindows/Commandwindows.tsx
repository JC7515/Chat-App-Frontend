import { PropsForCommandWindows } from '@/components/types'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Image from 'next/image'
import React from 'react'
import {  CONTACT_CHAT, iconsForChatsPage  } from '../ChatsContent.data'

interface Props {
    props: PropsForCommandWindows
}


const Commandwindows: React.FC<Props> = ({ props }) => {

    const userData = useAppSelector(state => state.userDataSlice.data)

    const contactData = useAppSelector(state => state.contactDataSlice.data)



    return (
        <>
            <div className={`${props.isOpenCardToSelectOptions || props.isOpenChannelCreationCard || props.isOpenJoinCardToChat || props.isOpenAddContactCard || props.wasNewIvitationIdCreated || props.isOpenCardToLeaveToGroup ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`} >

                <div className={`${props.isOpenCardToSelectOptions ? "" : "hidden"} relative w-[90%] h-72 flex flex-col justify-center items-center gap-5 bg-zinc-950 rounded-xl text-white sm:w-80 md:w-80 `} >
                    <button onClick={props.OpenCardToCreateChannel} className="w-[65%] py-3 bg-blue-500 rounded-lg">Create New Channel</button>
                    <button onClick={props.OpenCardToJoinChannel} className="w-[65%] py-3 bg-blue-500 rounded-lg">Enter to a Channel</button>
                    <div className="w-7 h-1 bg-zinc-500 rounded-md " ></div>
                    <button onClick={props.OpenCardToAddContact} className="w-[65%] py-3 bg-green-500 rounded-lg">Add New Contact</button>
                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseCardToSelectOptions} >{iconsForChatsPage[4].icon}</div>
                </div>



                <div className={`${props.isOpenChannelCreationCard ? "" : "hidden"} relative w-[90%] h-[28.125rem] flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                    <h3>New Channel</h3>
                    <form onSubmit={props.HandlerCreateNewChannel} ref={props.formToCreateChannel} className="w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%] ">
                        <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Channel name" id="channelName" name="channelName" />
                        <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Password Channel" id="channelPassword" name="channelPassword" />
                        <textarea className="outline-none w-full h-28 resize-none p-3 text-sm rounded-lg bg-zinc-700" name="channelDescription" id="channelDescription" placeholder="Channel Description"  ></textarea>
                        <input className="outline-none w-[60%] py-3 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32  md:self-end" type="button"
                            value="Save" onClick={props.HandlerCreateNewChannel} />
                    </form>
                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseCardOfCreateChannel} >{iconsForChatsPage[4].icon}</div>
                </div>



                <div className={`${props.wasNewIvitationIdCreated ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                    <h3>Invitation id</h3>

                    <div className='w-[80%] h-14 self flex flex-row justify-between items-center bg-zinc-700 p-3 gap-5 rounded-xl' onClick={props.CopyInvitationId}>
                        <input ref={props.inputOfInvitationId}
                            id="invitationIdInput" type="text" className='w-full flex flex-col justify-center items-start   whitespace-nowrap overflow-hidden selection:bg-transparent bg-zinc-700  text-white outline-none caret-transparent select ' onClick={props.CopyInvitationId} defaultValue={props.invitationId} />

                        <div onClick={props.CopyInvitationId} className='flex flex-col justify-center items-center w-4 h-4'>{!props.isInvitationIdCopied ? iconsForChatsPage[8].icon : iconsForChatsPage[9].icon}</div>
                    </div>

                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseCardOfInvitationIdCreated} >{iconsForChatsPage[4].icon}</div>


                </div>

                <div className={`${props.isOpenJoinCardToChat ? "" : "hidden"} relative w-[90%] h-72 flex flex-col justify-center items-center gap-8  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                    <h3>Join to a Channel</h3>
                    <form onSubmit={props.HandlerJoinToChannel} ref={props.formToJoinChannel} className="w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%]">
                        <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Insert Invitation Id" id="invitationId" name="invitationId" value={props.invitationId} onChange={(e) => props.setInvitationId(e.target.value)} />
                        <input className="outline-none w-full p-3 text-sm rounded-lg bg-zinc-700" type="text" placeholder="Insert Password" id="channelPassword" name="channelPassword" />
                        <input className="outline-none w-[50%] py-2 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32" type="button" value="Join" readOnly onClick={props.HandlerJoinToChannel} />
                    </form>
                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseCardOfJoinToChannel} >{iconsForChatsPage[4].icon}</div>
                </div>

                <div className={`${props.isOpenAddContactCard ? "" : "hidden"} relative w-[90%] h-96  flex flex-col pt-16 items-center mb-20 gap-8  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>
                    <h3>Add New Contact</h3>
                    <form onSubmit={props.RegisterNewContact} ref={props.formToCreateNewContact} className="relative w-[90%] flex flex-col justify-start  items-center gap-6 md:w-[80%]">
                        <div className="w-full h-11 flex flex-row items-center gap-1 p-2 bg-zinc-600 rounded-md">
                            {iconsForChatsPage[1].icon}
                            <input className="w-full text-xs bg-transparent outline-none" type="text" value={props.searchNewContactValue} placeholder="Search" onChange={props.HandlerSearchNewContacts} />
                        </div>

                        {props.searchNewContactValue && props.listOfNewContactSearched.length > 0 && (<>
                            <div className="absolute top-12 w-full h-max-64 flex flex-col justify-start items-center gap-3 p-3 bg-zinc-950 rounded-md">
                                <div className="w-full h-full flex flex-col justify-start items-center gap-3 p-3 overflow-scroll">
                                    {
                                        props.listOfNewContactSearched.map((contactFound: any): any => {
                                            return <div id={contactFound.user_id} key={contactFound.user_id}
                                                className="w-full h-15 flex flex-row justify-start items-center gap-3 p-2 bg-zinc-600 rounded-md" onClick={props.SelectUserForToBeNewContact}>
                                                <Image loading="eager" src={contactFound.profile_picture} id={contactFound.user_id} alt="ContactProfile" width="45" height="45" className="rounded-md" onClick={props.SelectUserForToBeNewContact} />
                                                <p id={contactFound.user_id} onClick={props.SelectUserForToBeNewContact}>{contactFound.username}</p>
                                            </div>
                                        })
                                    }

                                </div>

                                <div className="px-4 py-2 flex flex-row bg-zinc-700 gap-2 rounded-md" >
                                    <div onClick={props.SearchContactsOnPreviousPage} className="bg-blue-600 rounded-md px-3 py-1 cursor-pointer" >{"<"}</div>
                                    <span className="w-5 text-center bg-transparent">{props.offsetToSearchNewContacts}</span>
                                    <div onClick={props.SearchContactsOnNextPage} className="bg-blue-600 rounded-md px-3 py-1 cursor-pointer">{">"}</div>
                                </div>
                            </div>

                        </>
                        )
                        }


                        {props.searchNewContactValue && props.listOfNewContactSearched.length === 0 && (
                            <>
                                <div className="absolute top-12 w-full h-max-64 flex flex-col justify-center items-center gap-3 p-3 bg-zinc-950 rounded-md">
                                    <div className="w-full h-full flex flex-col justify-center items-center gap-3 p-3 bg-red-500 rounded-lg">

                                        <span className="p-3 text-sm rounded-lg ">matches not found</span>

                                    </div>
                                </div>
                            </>)
                        }


                        {props.userSelectedToBeNewContact.user_id ? (
                            <>
                                <h4>User Selected</h4>
                                <div className=" w-full h-15 flex flex-row justify-start items-center gap-3 p-2 bg-zinc-600 rounded-md">
                                    {/* <Image src={userSelectedToBeNewContact.profile_picture} alt="ContactProfile" width="45" height="45" className="rounded-md" /> */}
                                    <Image loading="eager" src={props.userSelectedToBeNewContact.profile_picture} alt="ContactProfile" width="45" height="45" className="rounded-md" />
                                    <p>{props.userSelectedToBeNewContact.username}</p>
                                    <div className="w-7 h-7 flex felx-col justify-center items-center ml-auto rounded-full bg-zinc-700 hover:bg-red-500" onClick={props.DeleteContactSelected}>
                                        {iconsForChatsPage[4].icon}
                                    </div>
                                </div>

                            </>

                        ) : (
                            <></>
                        )
                        }


                        <button className="outline-none w-[50%] py-2 bg-blue-500 shadow-md shadow-blue-500 rounded-lg md:w-32" onClick={props.RegisterNewContact}>Add Contact</button>


                    </form>

                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseCardOfAddContact} >{iconsForChatsPage[4].icon}</div>
                </div>


                <div className={`${props.isOpenCardToLeaveToGroup ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[40%] xl:w-[30%]`}>

                    <button onClick={props.LeaveTheGroup} className="w-[65%] py-3 bg-red-500 rounded-lg">Leave To Group</button>

                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseLeaveToGroupCard} >{iconsForChatsPage[4].icon}</div>

                </div>


            </div>

            {/* <div className={`${isOpenCardToSelectOptions ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}> */}
            <div className={`${props.isOpenCardToChangeRoleOfMember && props.isUserAdminToGroup ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}>

                <div className={`${props.isOpenCardToChangeRoleOfMember && props.isUserAdminToGroup ? "" : "hidden"} relative w-[90%] h-52 flex flex-col justify-center items-center gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>

                    <button onClick={props.DeleteMemberOfChat} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Member</button>

                    <button onClick={props.ConvertMemberToAdmin} className="w-[65%] py-3 bg-blue-500 rounded-lg">Change Member To Admin</button>

                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseCardOfChangeRoleOfMember} >{iconsForChatsPage[4].icon}</div>
                </div>

            </div>


            <div className={`${props.isOpenSettingsOfContactChat && userData.chat_type === CONTACT_CHAT ? "" : "hidden"} w-full h-screen fixed flex flex-col justify-center items-center  bg-fixed-for-add-channels z-40`}>

                <div className={`${props.isOpenSettingsOfContactChat && userData.chat_type === CONTACT_CHAT ? "" : "hidden"} relative w-[90%] h-64 flex flex-col justify-center items-center py-24 gap-6  bg-zinc-950 rounded-xl text-white md:w-[50%] xl:w-[30%]`}>

                    {/* <button onClick={DeleteMemberOfChat} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Member</button> */}

                    <button onClick={props.DeleteChatHistory} className="w-[65%] py-3 bg-red-500 rounded-lg">Delete Chat History</button>

                    <button onClick={contactData.is_blocked ? props.UnlockThisContact : props.BlockThisContact} className="w-[65%] py-3 bg-blue-500 rounded-lg">{contactData.is_blocked ? 'Unlock this Contact' : 'Block this Contact'}</button>

                    <button onClick={props.DeleteThisContact} className="w-[65%] py-3 bg-blue-500 rounded-lg">Delete This Contact</button>

                    <div className="absolute w-7 h-8 flex flex-col justify-center items-center top-[9px] right-[5px] text-white z-20 " onClick={props.CloseSettingsOfContactChat} >{iconsForChatsPage[4].icon}</div>
                </div>

            </div>
        </>
    )
}

export default Commandwindows