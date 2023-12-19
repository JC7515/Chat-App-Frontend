import { bodyMessage, propsToMessageComponent } from "@/components/types"
import Image from "next/image"
import myImage from '../../../../../public/myImage.jpg'

const Message = ( {message} : any ) => {
    return (
        <>
            <div key={message.user_id} className="w-full flex flex-row px-4 gap-4">
                <div className="w-10 h-full">
                    <Image src={myImage} width="25" height="25" className="w-full h-10 rounded-lg" alt="userImageMessage" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex flex-row justify-start items-center  gap-2">
                        <p className="text-sm text-zinc-300">{message.username}</p>
                        <p className="text-xs text-zinc-400">{`${message.date} ${message.hour}`}</p>
                    </div>
                    <p className="flex justify-start">{message.message_content}</p>
                </div>
            </div>
        </>
    )
}

export default Message