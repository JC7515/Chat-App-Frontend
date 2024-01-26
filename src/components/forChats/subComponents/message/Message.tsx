import { bodyMessage, propsToMessageComponent } from "@/components/types"
import Image from "next/image"
import myImage from '../../../../../public/myImage.jpg'
import { iconsForMessages } from "../../ChatsContent.data"

const Message = ({ message }: any) => {
    return (
        <>
            <div className={`flex flex-row ${message.  is_current_user_messsage ? 'self-end' : 'self-start'}`}>

                <div className={` ${!message.is_current_user_messsage ? '' : 'hidden'} w-2 h-2  bg-zinc-800 triangle-pointed-to-the-left`}></div>    
           

                <div key={message.user_id} className={`flex flex-row px-3 py-4 gap-4 rounded-for-messages-to-the-left sm:px-5 sm:py-5 ${message.is_current_user_messsage ?  'rounded-for-messages-to-the-right bg-zinc-700': 'rounded-for-messages-to-the-left bg-zinc-800'} `}>
                    {/* <div className="w-10 h-full">
                        <Image src={message.profile_picture ? message.profile_picture : '/'} width="25" height="25" className="w-full h-10 rounded-lg" alt="userImageMessage" />
                    </div> */}
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="flex flex-row justify-start items-center  gap-2">
                            <p className="text-sm text-zinc-300">{message.username}</p>
                            <p className="text-xs text-zinc-400">{`${message.date} ${message.hour}`}</p>
                        </div>
                        <div className="flex flex-row justify-between"> 
                        <p className="max-w-for-message whitespace-normal break-words text-sm md:text-base">{message.message_content}</p>
                        <div className={`${message.is_current_user_messsage ? '' : 'hidden'} flex self-end`}>{message.is_read? (iconsForMessages[1].icon) : (iconsForMessages[0].icon)}</div>

                        </div>
                    </div>

                </div>

                
                <div className={` ${message.is_current_user_messsage ? '' : 'hidden'} w-2 h-2  triangle-pointed-to-the-right bg-zinc-700`}></div>

            </div>
        </>
    )
}

export default Message