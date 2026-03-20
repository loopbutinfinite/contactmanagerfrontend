"use client";
import { Token } from '@/interfaces/userInterface';
import { CreateUser, GetUserByUsername, Login } from '@/lib/User-Fetches';
import { Checkbox, Modal, ModalBody, ModalHeader } from 'flowbite-react'
import { Button } from 'flowbite-react/components/Button'
import { Navbar } from 'flowbite-react/components/Navbar'
import { TextInput } from 'flowbite-react/components/TextInput'
import { Users, CircleQuestionMark, ChevronRight, LockIcon, MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const accountPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [accountCreation, setAccountCreation] = useState("");

  const [switchText, setSwitchText] = useState(true);

  const { push } = useRouter();

  const handleSwitchingTheTextFromSignInToCreateAccount = () => setSwitchText(!switchText);

  const handleSubmittingUserInfo = async () => {
    const loginDetails = {
      username,
      password
    }
    if (switchText) {
      const result = await CreateUser(loginDetails);
      setAccountCreation(result ? "Account has been successfully created!" : "Username already exists") //Change this to something else. Temp to see if it is working
      setOpenModal(true);
    } else {
      const token: Token | null = await Login(loginDetails);
      console.log(token?.token);

      if (token) {
        localStorage.setItem("token", token.token);
        await GetUserByUsername(username);

        push("/ContactManager")
      } else {
        setAccountCreation("Login Failed");
        setOpenModal(true);
      }
    }
  };


  return (
    <div className='bg-white'>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Status</ModalHeader>
        <ModalBody>{accountCreation}</ModalBody>
      </Modal>
      <Navbar fluid className="dark:bg-white border-b border-gray-20`0 py-4">
        <Navbar className='dark:bg-white'>
          <div className="flex dark:bg-white items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Users className="text-white w-5 h-5" />
            </div>
            <span className="text-indigo-600 me-2 text-3xl font-bold">ContactManager</span>
          </div>
        </Navbar>
        <div className="bg-white flex justify-end md:order-2 w-full max-w-sm">
          <CircleQuestionMark className='text-black'></CircleQuestionMark>
          <p className='ms-3 text-black'>Support</p>
        </div>
      </Navbar>
      <div className="grid min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{switchText ? "Create Account" : "Sign In"}</h1>
            <p className="text-gray-500">{switchText ? "Create an account to get started!" : "Enter your credentials to access your workspace"}</p>
          </div>
          <form className="flex flex-col gap-5">
            <div>
              <div className="mb-2 text-black block">
                <p>Email or Username</p>
              </div>
              <TextInput onChange={(event) => setUsername(event.target.value)} type="text" icon={MailIcon} placeholder="npc@email.com" required className='[&_input]:bg-white [&_input]:text-black' />
            </div>
            <div>
              <div className="mb-2 block text-black">
                <p>Password</p>
              </div>
              <TextInput onChange={(event) => setPassword(event.target.value)} type="password" icon={LockIcon} required placeholder='password123' className='[&_input]:bg-white [&_input]:text-black' />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="h-5 w-5 border-gray-300 text-indigo-600 dark:bg-white focus:ring-indigo-500" />
                <p className="font-medium text-black">Keep me signed in</p>
              </div>
              <Button className="text-sm font-bold dark:bg-white text-indigo-600 hover:dark:bg-white hover:underline">{switchText ? "" : "Forgot Password?"}</Button>
            </div>
            <Button onClick={handleSubmittingUserInfo} className="bg-indigo-600 hover:bg-indigo-700 mt-4 py-1">
              <div className="flex items-center gap-2 text-lg">
                {switchText ? "Create my Account" : "Sign In to Dashboard"}
                <ChevronRight></ChevronRight>
              </div>
            </Button>
          </form>
          <div className='grid'>
            <hr className='my-4 border-t-2 border-gray-300' />
            <div className='flex justify-center'>
              <p className='text-black mt-auto mb-auto'>New to the platform?</p>
              <Button onClick={handleSwitchingTheTextFromSignInToCreateAccount} className='text-indigo-600 font-semibold  dark:bg-white hover:dark:border-none hover:dark:bg-white hover:underline'>{switchText ? "Have an Account?" : "Forgot Password?"}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default accountPage