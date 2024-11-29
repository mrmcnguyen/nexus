'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DM_Sans } from 'next/font/google';

//!!!!!!!! REMEMBER TO VALIDATE INPUTS !!!!!!!!!

const dmSans = DM_Sans({ subsets: ["latin"] });

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient(); // Supabase client
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        console.error('Error during signup:', error);
      } else {
        setEmail('');
        setPassword('');
        sessionStorage.setItem('user', true);
        router.push('/dashboard'); // Redirect after successful sign-up
      }
    } catch (e) {
      console.error('Unexpected error:', e);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) {
        setErrorMessage(error.message);
        console.error('OAuth error:', error);
      }
    } catch (e) {
      console.error('Unexpected OAuth error:', e);
      setErrorMessage('An unexpected error occurred during OAuth sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image src="/nexusLogo.png" width={400} height={24} priority />
        {loading ? ( // Show loading spinner when loading is true
          <div className="flex items-center justify-center h-screen">
            <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="p-10 pb-5 pt-0 rounded-lg w-1/3">
              <h1 className="text-[#7098DA] font-normal text-2xl mb-5 text-center">Sign Up</h1>
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
                <div className="text-center mb-2 text-red-500">{errorMessage}</div>
              )}
              <button
                onClick={handleSignUp}
                className="w-full p-3 bg-[#6EB6FF] rounded font-light text-white hover:opacity-70"
              >
                Sign Up
              </button>
            </div>

            <div className="divider-wrapper relative flex items-center justify-center w-1/3">
              <span className="flex-grow h-[0.5em] border-b border-[#c2c8d0]"></span>
              <span className="mx-2 text-light text-black">OR</span>
              <span className="flex-grow h-[0.5em] border-b border-[#c2c8d0]"></span>
            </div>
            <div className="p-10 pt-5 pt-0 rounded-lg w-1/3 text-center">
              <button
                onClick={() => handleOAuthSignUp('google')}
                className="flex flex-row w-full p-3 mb-3 border-solid border border-[#c2c8d0] text-black font-light rounded hover:bg-[#0000001a]"
              >
                <Image
                  src="/googleLogo.svg"
                  className="mr-4"
                  width={24}
                  height={24}
                  priority
                />{' '}
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuthSignUp('azuread')}
                className="flex flex-row w-full p-3 mb-3 border-solid border border-[#c2c8d0] text-black font-light rounded hover:bg-[#0000001a]"
              >
                <Image
                  src="/Microsoft_logo.svg"
                  className="mr-4"
                  width={24}
                  height={24}
                  priority
                />{' '}
                Continue with Microsoft
              </button>
              <Link
                className="text-center text-gray-500"
                href={'./signIn'}
              >
                Already have an account? Log In
              </Link>
            </div>
          </>
        )}
        <footer className="text-gray-500">Nexus 2024 © </footer>
      </div>
  );
};

export default SignUp;