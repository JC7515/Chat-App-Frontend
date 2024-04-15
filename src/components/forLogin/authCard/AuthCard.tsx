"use client"
import Link from 'next/link'
import cookie from 'cookie'
import { useRef, useState, useEffect } from 'react'
import { logoForLogin, LOGO_TITLE } from '@/components/logo/Logo.data'
import { ACCESS_TOKEN_NAME, COOKIE_EXPIRES, COOKIE_HTTPONLY, COOKIE_OPTIONS, COOKIE_PATH, COOKIE_SECURE, iconsAuth0, iconsForLogin, REFRESH_TOKEN_NAME } from './AuthCard.data'
import { useRouter } from 'next/navigation'
import { CookieSerializer, ShowPassword } from '@/helpers'
import { iconsEmailVerificationPage } from '@/components/emailVerificationPage/EmailVerification.data'
import { bodyAccessTokens, FormEvent } from '@/components/types'


const AuthCard = () => {

  const router = useRouter()
  const form = useRef<HTMLFormElement>(null)

  const [failMessage, setFailMessage] = useState<any>('')
  const [loginIsLoading, setloginIsLoading] = useState(false)
  const [inputPasswordStatus, setInputPasswordStatus] = useState('password')




  const LoginHandler = async (e: FormEvent) => {
    e.preventDefault()

    setloginIsLoading(true)

    if (!form.current) return

    const formData = new FormData(form.current)
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    // console.log(payload)

    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login`

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
        // console.log('Registration failed try again.')
        setFailMessage(data.data.error)
        // console.log(failMessage)
        setloginIsLoading(false)
      }, 1100)
    }

    // console.log('entrando a la validacion de token')


    if (data.status === "OK") {

      const tokens: bodyAccessTokens = data.data

      // console.log(COOKIE_EXPIRES)
      // console.log(data.data.access_token)
      // console.log(data.data.refresh_token)

      // Obetenemos los valores del access_token y refresh_token
      const accessTokenValue: string = tokens.access_token
      const refreshTokenValue: string = tokens.refresh_token

      // Declaramos la opciones de nuestra cookie

      // Lista de cokkies a serializar
      const listOfcookies = [
        { name: ACCESS_TOKEN_NAME, value: accessTokenValue },
        { name: REFRESH_TOKEN_NAME, value: refreshTokenValue }
      ]

      // Bucle que serializa y registra las cookies en el objeto cookie del navegador
      CookieSerializer(listOfcookies, COOKIE_OPTIONS)
      // listOfcookies.forEach((cookieElem) => {
      //     document.cookie = cookie.serialize(cookieElem.name, cookieElem.value, cookieOptions)
      //  })

      setFailMessage('')

      router.push('/profile')

    }

  }

  useEffect(() => {
    setTimeout(() => {
      setFailMessage('')
    }, 15000)

  }, [failMessage])


  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white" >
      <div className="w-72 flex flex-col items-center gap-8 md:w-96 md:border-slate-400 md:border-2 md:rounded-3xl md:p-8">
        <div className='flex flex-col items-center gap-2 '>
          {logoForLogin.icon}
          <h1>{LOGO_TITLE}</h1>
        </div>

        <form onSubmit={LoginHandler} ref={form} className="w-full flex flex-col gap-4" aria-label='form Login'>
          <div className="w-full flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
            <div className='w-[25px]'>
              {iconsForLogin[0].icon}
            </div>
            <input className='bg-transparent w-[210px] outline-none sm:w-full' type="email" name="email" id="email" data-testid="email" placeholder="Email" />
          </div>
          <div className="w-full flex justify-between gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
            <div className='w-[25px]'>
              {iconsForLogin[1].icon}
            </div>
            <input className='w-[200px] outline-none sm:w-full bg-transparent' type={inputPasswordStatus} name="password" id="password" data-testid="password" placeholder="Password" />
            <div className='w-[25px]' onClick={() => ShowPassword(setInputPasswordStatus, inputPasswordStatus)}>{inputPasswordStatus === 'password' ? iconsForLogin[2].icon : iconsForLogin[3].icon}</div>
          </div>
          <button className="w-full  flex flex-row justify-center items-center gap-2 py-3 bg-blue-500 rounded-md text-white">{!loginIsLoading ? (<>Start coding now</>) : (<>{iconsEmailVerificationPage[3].icon} loading</>)}</button>
        </form>

        <div className="w-full flex flex-col gap-7 items-center">
          {/* <p className="border-zinc-400 text-sm">or continue with these social profile</p>
          <ul className='w-full flex flex-row justify-around'>
            {iconsAuth0.map(({ id, icon }) => {
              return <li className=' hover:border-black border-zinc-400 border-2 rounded-full p-2' key={id}>{icon}</li>
            })}
          </ul> */}
          <p>Adready a member?<Link className='ml-1 text-sky-500' href="/signUp">singUp</Link></p>
          <p className={`${failMessage ? '' : 'hidden'} bg-red-400 p-3 rounded-lg text-white`}>{failMessage}</p>
        </div>

      </div>
    </div>
  )
}

export default AuthCard