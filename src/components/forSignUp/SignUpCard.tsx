"use client"
import Link from 'next/link'
import { logoForLogin } from '@/components/logo/Logo.data'
import { iconsAuth0, iconsWithFrom } from '../forLogin/authCard/AuthCard.data'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'


const SignUpCard = () => {
   
  const router = useRouter()
  const form : any = useRef()

  const [ failMessage , setFailMessage ] = useState('')
  const [ passwordValue , setPasswordValue  ] = useState('')
  const [ verifyPasswordValue , setVerifyPasswordValue  ] = useState('')
  

   

  const SendFormDataToBackend = async (e: any) => {
    e.preventDefault()

    const verifiedPassword = passwordValue === verifyPasswordValue;

    if (!verifiedPassword) {
      return setFailMessage('Passwords do not match')
    }

    setFailMessage('wait')

    const formData = new FormData(form.current)
    const payload = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      birth_day: formData.get('birthday'),
      phone: formData.get('phone'),
      create_at: new Date(),
    }

    console.log(payload)

    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/signUp`

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
    
    console.log('no paso del push')

    router.push('/')

  }


  return (
    <div className="w-72 h-full flex flex-col items-center gap-8 my-8 md:w-96 md:border-slate-400 md:border-2 md:rounded-3xl md:p-8">
      <div className='flex flex-col items-center gap-2 '>
        {logoForLogin.icon}
        <h1>DevPros</h1>
      </div>

      <form onSubmit={SendFormDataToBackend} ref={form} className="w-full flex flex-col gap-4">
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
          {iconsWithFrom[0].icon}
          <input className='outline-none' type="text" name="name" id="name" placeholder="name and surname" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
          {iconsWithFrom[0].icon}
          <input className='outline-none' type="text" name="username" id="username" placeholder="User name" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3" >
          {iconsWithFrom[0].icon}
          <input className='outline-none' type="email" name="email" id="email" placeholder="Email" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          {iconsWithFrom[1].icon}
          <input className='outline-none' type="password" name="password" id="password" placeholder="Password" onChange={(e) => setPasswordValue(e.target.value)} />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          {iconsWithFrom[1].icon}
          <input className='outline-none' type="password" name="verifyPassword" id="verifyPassword" placeholder="Verify Password" onChange={(e) => setVerifyPasswordValue(e.target.value)} />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          {iconsWithFrom[1].icon}
          <input className='outline-none' type="date" name="birthday" id="birthday" placeholder="Verify Password" />
        </div>
        <div className="flex gap-2 border-zinc-300 border-2 rounded-md px-3 py-3">
          {iconsWithFrom[1].icon}
          <input className='outline-none' type="tel" name="phone" id="phone" placeholder="Phone" maxLength={10} />
        </div>
      
        <button className="w-full h-9 bg-blue-500 rounded-md text-white" >sign Up</button>
      </form>
      <div className="w-full flex flex-col gap-7 items-center">
        <p>Adready a member?<Link className='ml-1 text-sky-500' href="/">login</Link></p>
        <p>{failMessage}</p>
      </div>

    </div>
  )
}

export default SignUpCard