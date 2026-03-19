"use client";
import { Token } from '@/interfaces/userInterface';
import { CreateUser, GetUserByUsername, Login } from '@/lib/User-Fetches';
import { log } from 'console';
import { Checkbox, Label, Toast } from 'flowbite-react'
import { Button } from 'flowbite-react/components/Button'
import { Navbar } from 'flowbite-react/components/Navbar'
import { TextInput } from 'flowbite-react/components/TextInput'
import { Users, CircleQuestionMark, Mail, Lock, ChevronRight, LockIcon, EyeIcon, MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const accountPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [accountCreation, setAccountCreation] = useState("");

  const [switchText, setSwitchText] = useState(true);

  const {push} = useRouter();

  const handleSwitchingTheTextFromSignInToCreateAccount = () => setSwitchText(!switchText);

  const handleSubmittingUserInfo = async () => {
    const loginDetails = {
      username, 
      password
    }
    if (switchText){
      const result = await CreateUser(loginDetails);
      setAccountCreation(result ? "Account Created!" : "Username already exists" )
    } else {
      const token: Token | null = await Login(loginDetails);
      console.log(token?.token);

      if(token != null){
        if(typeof window != null){
          localStorage.setItem("token", token.token);
          await GetUserByUsername(username);

          push("/")
        } else{
          setAccountCreation("Login Failed!");
        }
      }
    }
  };


  return (
    <div className='bg-white'>
      <Navbar fluid className="dark:bg-white border-b border-gray-200 py-4">
        <Navbar className='dark:bg-white'>
          <div className="flex dark:bg-white items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Users className="text-white w-5 h-5" />
            </div>
            <span className="text-indigo-600 me-2 text-3xl font-bold">ContactManager</span>
          </div>
        </Navbar>
        <div className="bg-white flex md:order-2 w-full max-w-sm">
          <CircleQuestionMark className='text-black'></CircleQuestionMark>
          <p className='ms-3 text-black'>Support</p>
        </div>
      </Navbar>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{switchText ? "Create Account" : "Sign In"}</h1>
            <p className="text-gray-500">Enter your credentials to access your workspace.{accountCreation}</p>
          </div>
          <form className="flex flex-col gap-5">
            <div>
              <div className="mb-2 text-black block">
                <p>Email or Username</p>
              </div>
              <TextInput onChange={(event) => setUsername(event.target.value)} id="email" type="text" icon={MailIcon} placeholder="npc@email.com" required className='[&_input]:bg-white [&_input]:text-black'/>
            </div>
            <div>
              <div className="mb-2 block text-black">
                <p>Password</p>
              </div>
              <TextInput onChange={(event) => setPassword(event.target.value)} id="password" type="password" icon={LockIcon} required placeholder='password123' className='[&_input]:bg-white [&_input]:text-black'/>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="h-5 w-5 border-gray-300 text-indigo-600 dark:bg-white focus:ring-indigo-500" />
                <p className="font-medium text-black">Keep me signed in</p>
              </div>
              <Button onClick={handleSwitchingTheTextFromSignInToCreateAccount} href="#" className="text-sm font-bold dark:bg-white text-indigo-600 hover:dark:bg-white hover:underline">{switchText ? "Have an Account?" : "Forgot Password?"}</Button>
            </div>
            <Button onClick={handleSubmittingUserInfo} type="submit" className="bg-indigo-600 hover:bg-indigo-700 mt-4 py-1">
              <div className="flex items-center gap-2 text-lg">
                Sign In to Dashboard
                <ChevronRight></ChevronRight>
              </div>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default accountPage