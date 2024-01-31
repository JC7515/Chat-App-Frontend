import { GROUP_CHAT, iconsArrowForNavMenuChats, iconsForChatsPage, infoForNavMenuChat } from '@/components/forChats/ChatsContent.data'
import { PropsForGroupChat } from '@/components/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


interface Props {
  props: PropsForGroupChat
}

// const GroupMenuChat: React.FC<Props> = ({ props }) => {
const GroupMenuChat: React.FC<Props> = ({ props }) => {
  return (
    <>
      <div className={`${props.userData.chat_type === GROUP_CHAT && !props.menuOpen && props.isOpenAChat ? "" : "hidden"}  w-[282px] h-full bg-zinc-900 text-white absolute z-30 md:relative md:w-96 lg:w-96`} >
        <div className="w-full h-full grid grid-cols-1 bg-zinc-900 menu-chat-area gap-6 ">
          {/* chat de grupos */}
          <div className="w-full flex flex-col [grid-area:channels]  justify-start items-start gap-2">
            <div className="w-full h-16 flex flex-row justify-start items-center gap-4 border-b-4 pl-3 pr-5 border-zinc-950 shadow drop-shadow-xl" >
              <div className="w-6 h-6 flex flex-col justify-center items-center" onClick={props.BackToMenuHandler}>{iconsForChatsPage[5].icon}</div>
              <h1 className="font-semibold">All Channels</h1>

              <div className="w-6 h-6 flex felx-col justify-center items-center ml-auto rounded-full hover:bg-red-500" onClick={props.OpenLeaveToGroupCard}>{iconsForChatsPage[10].icon}</div>
            </div>

            <div className="w-full flex flex-col justify-between items-start gap-7 pl-7 pr-5 ">
              <div className="w-full flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{props.groupData.group_name}</h3>
                <p>{props.groupData.description}</p>
              </div>
            </div>
          </div>

          {/* chat de amigos  */}
          <div className="w-full flex flex-col [grid-area:contacts] justify-start items-start pl-7 pr-5 gap-5">
            <div className="w-full h-10 flex flex-row justify-between items-center  border-zinc-700 ">
              <h3 className="text-xl font-semibold">Members</h3>
            </div>

            <div className="w-full h-56 flex flex-col justify-start items-start gap-3 overflow-y-auto scroll-bar">
              {/* <div className="w-full flex flex-col  justify-between items-start gap-3"> */}
              {
                props.groupData.members.map((member: any) => {
                  return <div id={member.user.user_id} key={member.user.user_id} className="w-full h-12  flex flex-row items-center hover:pl-2 gap-3 " onClick={props.OpenCardOfChangeRoleOfMember}>
                    <Image loading="eager" src={member.user.profile_picture} width="35" height="35" className="rounded-md" alt='memberimageProfile' id={member.user.user_id} onClick={props.OpenCardOfChangeRoleOfMember} />
                    <p id={member.user.user_id} className='w-8/12 whitespace-nowrap overflow-hidden truncate' onClick={props.OpenCardOfChangeRoleOfMember}>{member.user.name}</p>
                    <div id={member.user.user_id} className={`${member.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}  w-2 h-2 rounded-full`} onClick={props.OpenCardOfChangeRoleOfMember}></div>
                    <div className={`${member.role === 'admin' ? '' : 'hidden'} flex flex-col justify-center items-center w-4 h-4`} >{iconsForChatsPage[7].icon}</div>
                  </div>

                })
              }

            </div>

            {
              props.groupData.members.map((member: any) => {
                return member.role === 'admin' && member.user.user_id === props.userData.user_id ? (<div id={member.user.user_id} key={member.user.group_id} className='w-full h-14 self flex flex-row justify-between items-center bg-zinc-700 p-3 gap-5 rounded-xl' onClick={props.CopyInvitationId}>
                  <input ref={props.inputOfInvitationId} id={member.user.user_id} className='w-full flex flex-col justify-center items-start   whitespace-nowrap overflow-hidden selection:bg-transparent bg-zinc-700  text-white outline-none caret-transparent select ' onClick={props.CopyInvitationId} defaultValue={props.invitationId} />

                  <div onClick={props.CopyInvitationId} className='flex flex-col justify-center items-center w-4 h-4'>{!props.isInvitationIdCopied ? iconsForChatsPage[8].icon : iconsForChatsPage[9].icon}</div>
                </div>) : (<></>)

              })
            }

          </div>


          <div className='w-full h-20 flex flex-row gap-4  items-center [grid-area:Navigation] self-end pl-7 pr-5' onClick={props.OpenNavigationMenuHandler} >
            {!props.userData.profile_picture ? (<>
              <div className="animate-pulse w-[40px] h-[40px] rounded-xl bg-zinc-700"></div>
            </>) : (<>
              <Image loading="eager" src={props.userData.profile_picture} className='rounded-lg' width="40" height="40" alt='profileImage' />
            </>)
            }
            <p className=" md:flex md:flex-col md:justify-center">{props.userData.username}</p>
            <div className="hidden md:flex-1 md:flex md:flex-col md:justify-center-end md:items-end">{

              props.menuOpen ? (iconsArrowForNavMenuChats[1].icon) : (iconsArrowForNavMenuChats[0].icon)

            }</div>
            {
              props.navigationMenuOpen &&
              <ul className='w-56 absolute bottom-20 left-9 flex flex-col justify-between items-center gap-1 bg-zinc-800 border-zinc-700 border-2 rounded-xl p-4' >
                {
                  infoForNavMenuChat.map((elem: any) => {
                    return elem.funtionLogOut ?
                      <li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li>
                      :
                      <Link href={elem.link} className='w-full' ><li key={elem.id} className={elem.class}>{elem.icon}<span>{elem.name}</span></li></Link>
                  })
                }
              </ul>
            }
          </div>
        </div>


      </div>

    </>
  )
}

export default GroupMenuChat