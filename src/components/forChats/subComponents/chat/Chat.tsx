import { PropsForChat } from '@/components/types'
import { useAppSelector } from '@/redux/hooks'
import Image from 'next/image'
import React from 'react'
import { CONTACT_CHAT, GROUP_CHAT, iconsForChatsPage } from '../../ChatsContent.data'
import Message from '../message/Message'

interface Props {
    props: PropsForChat
}

// const Chat: React.FC<Props> = ({ props }) => {
const Chat: React.FC<Props> = ({ props }) => {

    const userData = useAppSelector(state => state.userDataSlice.data)

    return (
        <>
            <div className="w-full h-full flex flex-col justify-between text-white bg-zinc-700 pb-1">
                <div className="relative w-full min-h-[63px] flex flex-row justify-start items-center bg-zinc-700 px-4 z-10 border-zinc-950 shadow drop-shadow-xl">
                    <div className={`mr-3 md:hidden`} onClick={props.MenuOpenHandler} >{iconsForChatsPage[3].icon}</div>

                    {/* **** aqui no se mostrara nada en caso de que el usuario no haya seleccionado ningun chat     **** */}
                    {
                        userData.chat_type === '' && (
                            <div className="w-auto h-4/5"></div>)
                    }


                    {/* **** aqui se mostrara el titulo del chat de grupo **** */}
                    {userData.chat_type === GROUP_CHAT && (<>

                        <div className="w-auto h-4/5 flex flex-row items-center gap-3 ">
                            <div className="w-10 h-10 flex flex-col justify-center items-center rounded-lg bg-zinc-900 ">{props.groupData.group_icon}</div>
                            <h2 className="w-48 font-semibold text-lg truncate overflow-hidden">{props.groupData.group_name}</h2>

                        </div>

                    </>)
                    }

                    {/* **** aqui se mostrara el titulo del chat de contacto **** */}
                    {
                        userData.chat_type === CONTACT_CHAT && (<>

                            <div className="w-auto h-4/5 flex flex-row items-center gap-3 ">
                                <Image alt="Contact Picture" src={props.contactData.contact_user.contact_blocked_you || !props.contactData.contact_user.profile_picture ? props.lockImage : props.contactData.contact_user.profile_picture} width='40' height="40" className="rounded-lg" />
                                <div className="flex flex-col gap-1">
                                    <h2 className="font-semibold text-base">{props.contactData.contact_user.username}</h2>
                                    <span className={`${props.contactData.contact_user.socket_id === 'empty' || props.contactData.contact_user.contact_blocked_you || props.contactData.is_blocked ? 'hidden' : ''} text-xs`}>{'online'}</span>
                                </div>
                                <div className={`${props.contactData.is_blocked ? '' : 'hidden'} flex flex-row gap-2 items-center `}> {iconsForChatsPage[12].icon}
                                    <p className="p-1 bg-red-700 rounded-lg">Bloqued</p>
                                </div>

                            </div>

                        </>)

                    }



                    {
                        userData.chat_type === CONTACT_CHAT && (<>
                            <div onClick={props.OpenSettingsOfContactChat} className={`flex flex-row justify-center items-center w-8 h-8 absolute z-40 right-5`}>{iconsForChatsPage[11].icon}</div>
                        </>)

                    }

                </div>
                <div ref={props.messagesContainer} onScroll={props.ValidateUserInRecentMessageArea} className={`${userData.chat_type === CONTACT_CHAT || userData.chat_type === GROUP_CHAT ? 'p-2 default-background-for-chat py-[50px] lg:pt-[10px] lg:pb-[0px] md:p-7 scroll-bar overflow-y-auto ' : ''} relative  w-full h-full flex flex-col justify-start items-start  gap-6  `}>
                    {/* este elemento sirve como una interseccion para que obtengamos una cantidad de mensajes antiguos cada vez que la vista del usuario pase por esta area */}
                    <div className="relative w-full h-[0.5px]">
                        <div ref={props.getOldMessagesArea} className="absolute w-full h-[60px] top-0 left-auto z-10"></div>
                    </div>

                    {

                        userData.chat_type === '' && (<div className="w-full h-full flex flex-col justify-center items-center gap-7 ">
                            <Image alt="logoForMessageArea Picture" src={props.logoForMessageArea}
                                width="280" height="280" className="w-[290px] h-[290px] md:w-[300px] md:h-[300px]" />
                            <div className="w-[80%] flex flex-col items-center justify-center gap-5 sm:w-[70%]">
                                <p className="w-full text-zinc-100 text-center text-xl font-extralight md:text-2xl" >Download Chatify soon in ios and android application</p>
                                <p className="text-zinc-400 text-sm text-center font-light sm:text-base" >Chatify soon in ios and android application</p>

                            </div>
                            {/* <button className="text-zinc-200 py-3 px-5 rounded-full font-light bg-blue-500 hover:bg-blue-200">Get more information</button>
                                 */}
                            <div className="text-zinc-200 py-3 px-5 rounded-full font-light cursor-pointer bg-blue-500 hover:bg-blue-700 z-20 ">Get more information</div>
                        </div>)
                    }

                    {
                        userData.chat_type === CONTACT_CHAT && !props.contactData.is_contact_validated && (<>
                            <div className="w-full flex flex-col items-center gap-7 bg-zinc-800 pt-8 pb-10 rounded-lg">
                                <span>¿Do you know this user?</span>

                                <button onClick={props.BlockingForNotKnowingTheUser} className="w-72 py-3 border-red-500 hover:bg-red-500 border-2 rounded-lg text-sm text-center ">Block This Contact</button>

                                <button onClick={props.AddThisContact} className="w-72 py-3 border-zinc-200 hover:bg-zinc-200 border-2 rounded-lg text-sm text-center ">Add This Contact</button>
                            </div>
                        </>)
                    }


                    {
                        props.chatmessages.length > 0 ? (
                            <>{
                                props.chatmessages.map((message) => {
                                    return (<>
                                        {message.message_type === 'text' && (
                                            <>
                                                <Message key={message.message_id} message={message} />

                                            </>)
                                        }
                                        {message.message_type === 'unreadMessage' && (
                                            <>
                                                <p id={message.notification_id} key={message.notification_id} className="mx-auto text-xs p-3 bg-zinc-900 rounded-xl">{`${props.numberOfUnreadMessages} unread messages`}</p>
                                            </>)
                                        }

                                        {message.message_type === 'unionDate' && (
                                            <>
                                                <div id={message.message_id} key={message.message_id} className="w-full flex flex-col justify-center items-center mx-auto ">
                                                    <p className="mx-auto text-xs p-4 bg-zinc-900 rounded-xl">{`user ${message.username} joined the group`}</p>
                                                </div>
                                            </>)
                                        }
                                        {message.message_type === 'emitionDate' && (
                                            <>
                                                <div id={message.emition_id} key={message.emition_id} className="w-full flex flex-col justify-center items-center mx-auto   ">
                                                    <p className="mx-auto text-sm p-4 bg-zinc-900 rounded-xl">{message.emition_date}</p>
                                                </div>
                                            </>)
                                        }
                                    </>
                                    )
                                })
                            }</>)
                            :
                            (<div className="w-full h-full"></div>)


                    }
                    {/* este elemento es una interseccion que nos sirve para saber si el usuario se encuentra mierando los mensajes mas reciente o esta navegando por los mensajes antiguos*/}
                    <div className={`${userData.chat_type === CONTACT_CHAT || userData.chat_type === GROUP_CHAT ? '' : 'hidden'} relative w-full h-[0.5px]`}>
                        <div ref={props.recentMessagesArea} className="absolute w-full h-[190px] bottom-0 left-auto z-10"></div>
                    </div>
                </div>
                {/* bg-zinc-700 */}
                <div className={`${userData.chat_type === CONTACT_CHAT || userData.chat_type === GROUP_CHAT ? '' : 'hidden'} absolute w-full h-[70px] left-0 bottom-0 z-10 flex flex-col py-[10px]  justify-center items-center bg-zinc-700 lg:relative`}>
                    <div className="relative w-full h-full flex flex-row justify-center items-center">
                        <div className="absolute bottom-[68px] right-3 w-28 flex flex-row justify-end items-end gap-4 z-10 md:right-20 md:bottom-[68px] ">
                            {userData.chat_id ?
                                (<>
                                    <div className={`${!props.isUserInRecentMessagesArea && props.numberOfUnreadMessagesForIcon ? "" : "hidden"} w-11 h-11 flex flex-col justify-center items-center bg-blue-500 rounded-full font-medium`}>{!props.isUserInRecentMessagesArea && props.numberOfUnreadMessagesForIcon ? props.numberOfUnreadMessagesForIcon : ''}</div>
                                    <div className={`${userData.chat_id && props.isUserInRecentMessagesArea ? "hidden" : ""} w-14 h-14 flex flex-col justify-center items-center bg-zinc-950 rounded-full hover:bg-zinc-800`} onClick={props.DownToRecentMessageAreaHandler}>{(userData.chat_id && props.isUserInRecentMessagesArea) ? <></> : iconsForChatsPage[6].icon}</div>
                                </>)
                                :
                                (<></>)
                            }
                        </div>
                        {/* bg-zinc-600 */}
                        <form onSubmit={userData.chat_type === GROUP_CHAT ? props.GroupMessageSendingHandle : props.ContactMessageSendingHandle} className={`${userData.chat_id ? "" : "hidden"} relative h-14 w-[95%] flex flex-row justify-between items-center pr-2 bg-zinc-600 rounded-md`}>
                            <input className="outline-none flex-1 bg-transparent text-xs p-3" type="text" placeholder="Type a message here" value={props.message} onChange={props.changeValueOfMessage} />
                            <button className="w-9 h-10 flex flex-col justify-center items-center bg-blue-500 rounded-lg">
                                {iconsForChatsPage[2].icon}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat