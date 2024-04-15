'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { iconsEmailVerificationPage } from "./EmailVerification.data"
import { GetUserData } from "@/helpers"
import { useRouter } from "next/navigation"
import { ResendVerifyEmail, VerifyUserEmailValidationToken } from "@/utils"
import { validatedEmailUser, FormEvent } from "../types"


const EmailVerification = () => {

  const urlParams = useParams()

  const [userData, setUserData] = useState<validatedEmailUser>()
  const [theVerifyIsLoagin, setTheVerifyIsLoagin] = useState<boolean>(true)
  const [resultOfResendVerifyEmail, setResultOfResendVerifyEmail] = useState<string>('')
  const [emailToReSendValidation, setEmailToReSendValidation] = useState<string>('')
  const [resendIsLoading, setResendIsLoading] = useState<boolean>(false)
  const [emailForwardedSuccessfully, setEmailForwardedSuccessfully] = useState<boolean>(false)





  const ResendVerifyEmailHandler = async (e: FormEvent) => {
    setResultOfResendVerifyEmail('')
    setEmailForwardedSuccessfully(false)

    e.preventDefault()

    if (!emailToReSendValidation) return setResultOfResendVerifyEmail('Enter an email')

    setResendIsLoading(true)

    const resp = await ResendVerifyEmail(emailToReSendValidation)


    setTimeout(() => {
      // aqui estamos cambiando el valor EmailForwardedSuccessfully para que se muestre un check en el botton si el reenvio de email fue exito 
      setEmailForwardedSuccessfully(true)
      setResendIsLoading(false)
      setResultOfResendVerifyEmail(resp)
    }, 1800)

  }


  useEffect(() => {


    const UserDataFunc = async () => {
      // aqui estamos extrayendo el valor del parametro urlVerification de la url con el useParams()
      const { urlVerification } = urlParams
      // console.log(urlVerification)

      const resp: validatedEmailUser = await VerifyUserEmailValidationToken(urlVerification)


      // console.log(resp)

      //aqui estamos actualizando los datos de user data y ahciendo desaparecer el icono de loading 
      setTimeout(() => {
        setUserData(resp)
        setTheVerifyIsLoagin(false)
        // console.log(theVerifyIsLoagin)
      }, 500)


    }

    UserDataFunc()

  }, [])

  useEffect(() => {

    // aqui estamos reiniciando el valor de setEmailForwardedSuccessfully para que desaparesca el check del buttom y tambien el mensaje de que el email de validacion fue reenviado con exito
    if (emailForwardedSuccessfully) {
      setTimeout(() => {
        setEmailForwardedSuccessfully(false)
        setResultOfResendVerifyEmail('')
      }, 10000)

    }

  }, [emailForwardedSuccessfully])


  return (
    <section className="w-full h-screen bg-zinc-800 flex 
    flex-col justify-center items-center">


      {userData && !theVerifyIsLoagin &&
        (<>
          <div className="w-[300px] h-96 flex flex-col justify-start items-center gap-5 bg-zinc-900 rounded-xl px-4 ">
            <h1 className="text-white text-lg text-center mt-8">Welcome to Chatify.</h1>

            <div className="w-full flex flex-col justify-center items-center gap-6 mt-6">
              <div className='' >{iconsEmailVerificationPage[0].icon}</div>
              <p className="text-white text-center">Your email have been successfully verified.</p>
            </div>

            <Link href="/profile" className="text-white p-3 bg-blue-400 hover:bg-blue-500 mt-5 rounded-lg">go to profile</Link>
          </div>
        </>)
      }


      {!userData && !theVerifyIsLoagin && (<>
        <div className="w-[300px] flex flex-col justify-start items-center gap-5 bg-zinc-900 rounded-xl px-4 pb-9">
          <h1 className="text-white text-lg text-center mt-8">Upss...</h1>
          <div className="w-full flex flex-col justify-center items-center gap-6 mt-5">
            <div className='' >{iconsEmailVerificationPage[1].icon}</div>
            <p className="text-white text-center">An error occurred while verifying your email, please try again.</p>
          </div>
          <div className="w-full h-[1.5px] bg-blue-400"></div>
          <form className="flex flex-col justify-center items-center text-white gap-5" onSubmit={ResendVerifyEmailHandler}>
            <label htmlFor="email" >Enter your email</label>
            <input className='outline-none  bg-transparent border-2 border-blue-400 rounded-lg px-3 py-2' type="email" name="email" id="email" placeholder="Email" onChange={(e: any) => setEmailToReSendValidation(e.target.value)} />
            <button className="w-full flex flex-row justify-center items-center text-white p-3 bg-blue-400 hover:bg-blue-500 mt-5 rounded-lg gap-2" onClick={ResendVerifyEmailHandler}>{!resendIsLoading && !emailForwardedSuccessfully && (<>
              Resend validation email
            </>)}
              {resendIsLoading && (<>
                {iconsEmailVerificationPage[3].icon} loading
              </>)
              }
              {!resendIsLoading && emailForwardedSuccessfully && (<>
                {iconsEmailVerificationPage[4].icon}</>)
              }
            </button>
          </form>
        </div>
        {
          resultOfResendVerifyEmail && (<>
            <div className={`${emailForwardedSuccessfully ? 'bg-blue-400' : 'bg-red-400'} w-[300px] flex flex-col justify-center items-center p-3  rounded-lg mt-4`}>{resultOfResendVerifyEmail}</div>
          </>)
        }

      </>)
      }

      {!userData && theVerifyIsLoagin && (<>

        <div className="animate-spin">{iconsEmailVerificationPage[2].icon}</div>

      </>)
      }

    </section >
  )
}

export default EmailVerification