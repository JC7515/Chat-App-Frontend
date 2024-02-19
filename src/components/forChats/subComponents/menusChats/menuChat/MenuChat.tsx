import { CONTACT_CHAT, GROUP_CHAT, iconsArrowForNavMenuChats, iconsForChatsPage, infoForNavMenuChat } from '@/components/forChats/ChatsContent.data'
import { groupBody, groupData, type PropsForMenuChat } from '@/components/types'
import { useAppSelector } from '@/redux/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SearchBar from '../searchBar/SearchBar'

interface Props {
  props: PropsForMenuChat
}

// const MenuChat: React.FC<> = ({menuOpen, isOpenAChat, userData, contactsList, groupChatsList, navigationMenuOpen}: any) => {
const MenuChat: React.FC<Props> = ({ props }) => {

  const contactsList = useAppSelector(state => state.contactsListSlice.data)
  const groupChatsList = useAppSelector(state => state.groupChatsListSlice.data)
  const userData = useAppSelector(state => state.userDataSlice.data)



  return (
    <div  className={`${props.menuOpen && !props.isOpenAChat || userData.chat_type === CONTACT_CHAT && screen.width > 768 || userData.chat_type === '' && screen.width > 768 ? "" : "hidden"}  w-[282px] h-full bg-zinc-900 text-white absolute z-30  md:relative md:w-96 lg:w-96`} >
      <div className="w-full h-full grid grid-cols-1 bg-zinc-900 menu-chat-area gap-2 ">
        {/* chat de grupos */}
        <div className="w-full flex flex-col [grid-area:channels]  justify-start items-start gap-2">
          <div className="w-full h-16 flex flex-row justify-between items-center border-b-4 pl-7 pr-5 border-zinc-950 shadow drop-shadow-xl" >
            {/* <div>{iconsForChatsPage[5].icon}</div> */}
            <h1 className="font-semibold">Channels</h1>
            <div className="w-6 h-6 flex flex-col justify-center items-center rounded-md bg-zinc-700" onClick={props.OpenCardToSelectOptions}>{iconsForChatsPage[0].icon}</div>
          </div>

          <div className="w-full flex flex-col justify-between items-start gap-7 pl-7 pr-5 overflow-hidden ">

            <SearchBar chatType={GROUP_CHAT} />

            <div key={userData.user_id} className="w-full h-32 flex flex-col justify-start items-start gap-2 overflow-y-auto scroll-bar">
              {
                groupChatsList.map(({ group, notifications_number }: groupBody) => {
                  return <div key={group.group_id} id={group.group_id}  className="w-full py-3 pr-4 flex flex-row justify-start items-center hover:pl-2 gap-3 hover:bg-zinc-700 rounded-lg" onClick={props.CloseMenuOpenGroupChatHandler}>
                    <div id={group.group_id} onClick={props.CloseMenuOpenGroupChatHandler}>{group.group_icon}</div>
                    <h2 id={group.group_id} className="w-auto h-6 whitespace-nowrap overflow-hidden " onClick={props.CloseMenuOpenGroupChatHandler}>{group.group_name}</h2>
                    <p id={group.group_id} className={`${notifications_number > 0 ? '' : 'hidden'} w-6 h-6 flex flex-row justify-center  items-center ml-auto rounded-full bg-blue-500 text-sm`}>{notifications_number}</p>

                  </div>
                })
              }

            </div>
          </div>
        </div>

        {/* chat de amigos  */}
        <div className="w-full flex flex-col [grid-area:contacts] justify-start items-start pl-7 pr-5 gap-2">
          <div className="w-full h-16 flex flex-row justify-between items-center border-t-2 border-zinc-700 ">
            <h1 className="font-semibold">Contacts</h1>
          </div>

          <div className="w-full flex flex-col justify-between items-start gap-7 ">

            <SearchBar chatType={CONTACT_CHAT} />

            <div key={userData.user_id} className="w-full h-32 flex flex-col  justify-start items-start gap-3  overflow-y-auto scroll-bar ">
              {
                contactsList.map((contact: any) => {
                  return <div id={contact.chat_id} key={contact.chat_id} className="w-full py-2 pr-4 flex flex-row items-center hover:pl-2 gap-3 hover:bg-zinc-700 rounded-lg" onClick={props.CloseMenuOpenContactChatHandler}>
                    {contact.contact_user.profile_picture ? (<>
                      <Image loading="eager" id={contact.chat_id} alt="profile Picture" src={contact.contact_user.contact_blocked_you ? props.lockImage : contact.contact_user.profile_picture} width={38} height={38} className="rounded-lg" onClick={props.CloseMenuOpenContactChatHandler} />

                    </>)
                      :
                      (<>
                        <div id={contact.chat_id} onClick={props.CloseMenuOpenContactChatHandler}>{contact.contact_user.contact_icon}</div>
                      </>)}

                    <h2 id={contact.chat_id} onClick={props.CloseMenuOpenContactChatHandler} >{contact.contact_user.username}</h2>

                    {/* Aqui signos de bloqueo y notificaciones */}
                    <p className={`${contact.notifications_number > 0 ? '' : 'hidden'} w-6 h-6 flex flex-row justify-center  items-center ml-auto rounded-full bg-blue-500 text-sm`}>{contact.notifications_number}</p>
                  </div>
                })
              }
            </div>

          </div>
        </div>


        <div className='w-full h-20 flex flex-row gap-4  items-center [grid-area:Navigation] self-end pl-7 pr-5' onClick={props.OpenNavigationMenuHandler} >
          {!userData.profile_picture ? (<>
            <div className="animate-pulse w-[40px] h-[40px] rounded-xl bg-zinc-200"></div>
          </>) : (<>
            <Image loading="eager" src={userData.profile_picture} className='rounded-lg' width="40" height="40" alt='profileImage' />
          </>)
          }
          <p className=" md:flex md:flex-col md:justify-center">{userData.username}</p>
          <div className="hidden md:flex-1 md:flex md:flex-col md:justify-center-end md:items-end">{

            props.navigationMenuOpen ? (iconsArrowForNavMenuChats[1].icon) : (iconsArrowForNavMenuChats[0].icon)

          }</div>
          {
            props.navigationMenuOpen &&
            <ul className='w-56 absolute bottom-20 left-9 flex flex-col justify-between items-center gap-1 bg-zinc-800 border-zinc-700 border-2 rounded-xl p-4' >
              {
                infoForNavMenuChat.map((elem) => {
                  return elem.funtionLogOut ?
                    <li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li>
                    :
                    <Link key={elem.id} href={elem.link} className='w-full' ><li className={elem.class}>{elem.icon}<span>{elem.name}</span></li></Link>
                })
              }
            </ul>
          }

        </div>
      </div>


    </div>
  )
}

export default MenuChat