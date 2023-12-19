"use client"
import Link from 'next/link'
import cookie from 'cookie'
import { useRef, useState } from 'react'
import { logoForLogin } from '@/components/logo/Logo.data'
import { ACCESS_TOKEN_NAME,  COOKIE_EXPIRES, COOKIE_HTTPONLY, COOKIE_OPTIONS, COOKIE_PATH, COOKIE_SECURE, iconsAuth0, iconsWithFrom, REFRESH_TOKEN_NAME } from './AuthCard.data'
import { useRouter } from 'next/navigation'
import { CookieSerializer } from '@/helpers'


const AuthCard = () => {


  const router = useRouter()
  const form: any = useRef()

  const [failMessage, setFailMessage] = useState('')



  const LoginHandler = async (e: any) => {
    e.preventDefault()

    setFailMessage('wait')

    const formData = new FormData(form.current)
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    console.log(payload)

    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login`

    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('paso del envio de informacion')

    const data = await resp.json()

    console.log('no paso del objeto data')

    if (data.status === "FAILED") {
      console.log('Registration failed try again.')
      setFailMessage(data.data.error.message)
    }

    console.log('entrando a la validacion de token')


    if (data.status === "OK") {

      console.log(COOKIE_EXPIRES)
      console.log(data.data.access_token)
      console.log(data.data.refresh_token)

      // Obetenemos los valores del access_token y refresh_token
      const accessTokenValue: string = data.data.access_token
      const refreshTokenValue: string = data.data.refresh_token

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

      router.push('/profile')

    }

  }


  return (
    <div className="w-72 flex flex-col items-center gap-8 md:w-96 md:border-slate-400 md:border-2 md:rounded-3xl md:p-8">
      <div className='flex flex-col items-center gap-2 '>
        {logoForLogin.icon}
        <h1>DevPros</h1>
      </div>

      <form onSubmit={LoginHandler} ref={form} className="w-full flex flex-col gap-4">
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
          {iconsWithFrom[0].icon}
          <input className='outline-none' type="email" name="email" id="email" placeholder="Email" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          {iconsWithFrom[1].icon}
          <input className='outline-none' type="password" name="password" id="password" placeholder="Password" />
        </div>
        <button className="w-full h-9 bg-blue-500 rounded-md text-white">Start coding now</button>
      </form>

      <div className="w-full flex flex-col gap-7 items-center">
        <p className="border-zinc-400 text-sm">or continue with these social profile</p>
        <ul className='w-full flex flex-row justify-around'>
          {iconsAuth0.map(({ id, icon }) => {
            return <li className=' hover:border-black border-zinc-400 border-2 rounded-full p-2' key={id}>{icon}</li>
          })}
        </ul>
        <p>Adready a member?<Link className='ml-1 text-sky-500' href="/signUp">singUp</Link></p>
        <p>{failMessage}</p>
      </div>

    </div>
  )
}

export default AuthCard