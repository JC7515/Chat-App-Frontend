"use client"
import Link from 'next/link'
import { logoForLogin } from '@/components/logo/Logo.data'
import { iconsAuth0, iconsForLogin } from '../forLogin/authCard/AuthCard.data'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { iconsEmailVerificationPage } from '../emailVerificationPage/EmailVerification.data'
import { LimitYear, ShowPassword } from '@/helpers'
import { FormEvent } from '../types'
import { iconsForSignUp } from './SignUpCard.data'


const SignUpCard = () => {

  const router = useRouter()
  const form = useRef<HTMLFormElement>(null)

  const [failMessage, setFailMessage] = useState<string>('')
  const [signUpIsLoading, setsignUpIsLoading] = useState<boolean>(false)

  const [inputPasswordStatus, setInputPasswordStatus] = useState<string>('password')




  const SendFormDataToBackend = async (e: FormEvent) => {
    e.preventDefault()


    setsignUpIsLoading(true)

    if (!form.current) return

    const formData = new FormData(form.current)
    const payload = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      verifyPassword: formData.get('verifyPassword'),
      birth_day: formData.get('birthday'),
      phone: formData.get('phone'),
      create_at: new Date(),
    }

    // console.log(payload)

    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/signUp`

    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // console.log('paso del envio de informacion')

    const data = await resp.json()


    // console.log('no paso del objeto data')

    if (data.status === "FAILED") {
      setTimeout(() => {
        setFailMessage(data.data.error)
        setsignUpIsLoading(false)
      }, 1100)

      return
    }

    // console.log('no paso del push')


    setTimeout(() => {
      setFailMessage('')
      setsignUpIsLoading(false)
      form.current?.reset()
      router.push('/')
    }, 1400)

  }

  useEffect(() => {
    setTimeout(() => {
      setFailMessage('')
    }, 15000)

  }, [failMessage])



  return (
    <div className="w-72 h-full flex flex-col items-center gap-8  my-8 md:w-96 md:border-slate-400 md:border-2 md:rounded-3xl md:p-8">
      <div className='flex flex-col items-center gap-2 '>
        {logoForLogin.icon}
        <h1>DevPros</h1>
      </div>

      <form onSubmit={SendFormDataToBackend} ref={form} className="w-full flex flex-col gap-4">
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
          {iconsForSignUp[2].icon}
          <input className='outline-none' type="text" name="name" id="name" placeholder="name and surname" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
          {iconsForSignUp[2].icon}
          <input className='outline-none' type="text" name="username" id="username" placeholder="User name" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
          {iconsForSignUp[0].icon}
          <input className='outline-none' type="email" name="email" id="email" placeholder="Email" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          <div className='w-[25px]'>
            {iconsForSignUp[1].icon}
          </div>
          <input className='bg-transparent w-[200px] outline-none sm:w-full' type={inputPasswordStatus} name="password" id="password" placeholder="Password" />
          <div onClick={() => ShowPassword(setInputPasswordStatus, inputPasswordStatus)}>{inputPasswordStatus === 'password' ? iconsForLogin[2].icon : iconsForLogin[3].icon}</div>
        </div>

        <p className={`${failMessage ? '' : 'hidden'} text-red-400 text-xs`}>{failMessage}</p>

        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          <div className='w-[25px]'>
            {iconsForSignUp[1].icon}
          </div>
          <input className='bg-transparent w-[200px] outline-none sm:w-full' type={inputPasswordStatus} name="verifyPassword" id="verifyPassword" placeholder="Verify Password" />
          <div onClick={() => ShowPassword(setInputPasswordStatus, inputPasswordStatus)}>{inputPasswordStatus === 'password' ? iconsForLogin[2].icon : iconsForLogin[3].icon}</div>
        </div>

        <p className={`${failMessage ? '' : 'hidden'} text-red-400 text-xs`}>{failMessage}</p>

        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          {iconsForSignUp[3].icon}
          <input className='outline-none' type="date" name="birthday" id="birthday" max="2024-12-31" onKeyDown={LimitYear} onBlur={LimitYear} />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          {iconsForSignUp[4].icon}
          <input className='outline-none' type="tel" name="phone" id="phone" placeholder="Phone" maxLength={10} />
        </div>

        <button className="w-full  flex flex-row justify-center items-center gap-2 py-3 bg-blue-500 rounded-md text-white" onClick={SendFormDataToBackend}>{!signUpIsLoading ? (<>sign Up</>) : (<>{iconsEmailVerificationPage[3].icon} loading</>)}</button>
      </form>

      <div className="w-full flex flex-col gap-7 items-center">
        <p>Adready a member?<Link className='ml-1 text-sky-500' href="/">login</Link></p>
        <p className={`${failMessage ? '' : 'hidden'} bg-red-400 p-3 rounded-lg text-white`}>{failMessage}</p>
      </div>

    </div>
  )
}

export default SignUpCard