'use client'
import { useState } from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase';
import { OAuthProvider, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()

  const googleProvider = new GoogleAuthProvider();
  const microsoftProvider = new OAuthProvider('microsoft.com');

  const handleSignIn = async () => {
    try {
        const res = await signInWithEmailAndPassword(email, password);
        console.log({res});
        sessionStorage.setItem('user', true)
        setEmail('');
        setPassword('');
        router.push('/dashboard')
    }catch(e){
        console.error(e)
        setErrorMessage(e.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
       <Image
    src="/nexusLogo.png"
    width={400}
    height={24}
    priority
  />
      <div className=" p-10 pb-5 pt-0 rounded-lg w-1/3">
        <h1 className="text-[#7098DA] font-normal text-2xl mb-5 text-center">Welcome back</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded border-solid border border-[#c2c8d0] outline-none text-[#2d333a] placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded border-solid border border-[#c2c8d0] outline-none text-[#2d333a] placeholder-gray-500"
        />
        {errorMessage && (
  <div className='text-center mb-2 text-red-500'>
    {errorMessage}
  </div>
)}
        <button 
          onClick={handleSignIn}
          className="w-full p-3 bg-[#6EB6FF] rounded font-light text-white hover:opacity-70"
        >
          Continue
        </button>
      </div>

      <div className="divider-wrapper relative flex items-center justify-center w-1/3">
  <span className="flex-grow h-[0.5em] border-b border-[#c2c8d0]"></span>
  <span className="mx-2 text-light">OR</span>
  <span className="flex-grow h-[0.5em] border-b border-[#c2c8d0]"></span>
</div>
<div className=" p-10 pt-5 pt-0 rounded-lg w-1/3 text-center">
<button 
          onClick={() => signInWithRedirect(auth, googleProvider)}
          className=" flex flex-row w-full p-3 mb-3 border-solid border border-[#c2c8d0] text-black font-light rounded hover:bg-[#0000001a]"
        >
          <Image
              src="/googleLogo.svg"
              className="mr-4"
              width={24}
              height={24}
              priority
            /> Continue with Google
        </button>

        <button 
          onClick={() => signInWithRedirect(auth, microsoftProvider)}
          className=" flex flex-row w-full p-3 mb-3 border-solid border border-[#c2c8d0] text-black font-light rounded hover:bg-[#0000001a]"
        >
          <Image
              src="/Microsoft_logo.svg"
              className="mr-4"
              width={24}
              height={24}
              priority
            /> Continue with Microsoft
        </button>
        <Link className='text-center text-gray-500' href={'./signUp'}>Don't have an account? Sign Up</Link>
    </div>
    <footer className='text-gray-500'>Nexus 2024 © </footer>
</div>
  );
};

export default SignIn;