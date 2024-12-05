'use client';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { createClient } from '../../../supabase/client'
import { addUser, trial } from '../../lib/db/queries';

const dmSans = DM_Sans({ subsets: ['latin'] });

//!!!!!!!! REMEMBER TO VALIDATE INPUTS !!!!!!!!!

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async () => {
    try {
      setLoading(true); // Start loading
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Signed in:', data);
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/dashboard'); // Redirect to dashboard
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message || 'An error occurred while signing in.');
      setLoading(false); // Stop loading if error occurs
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      console.log(provider);
      setLoading(true); // Start loading
      const { error } = await supabase.auth.signInWithOAuth({ provider });

      if (error) throw error;
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message || `Error signing in with ${provider}.`);
      setLoading(false); // Stop loading if error occurs
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image alt="logo" src="/nexusLogo.png" width={400} height={24} priority/>
        <div>
        <div className="p-10 pb-5 pt-0 rounded-lg">
          <h1 className="text-[#7098DA] font-normal text-2xl mb-5 text-center">
            Welcome back
          </h1>
          {loading ? (
            // Show a loading spinner while loading
            <div className="flex justify-center items-center">
              <div className="loader my-4 border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#292929] mb-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded border-solid border border-gray-700 outline-none text-white placeholder-gray-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 bg-[#292929] focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded border-solid border border-gray-700 outline-none text-white placeholder-gray-500"
              />
              {errorMessage && (
                <div className="text-center mb-2 text-red-500">{errorMessage}</div>
              )}
              <button
                onClick={handleSignIn}
                className="w-full p-3 bg-[#6EB6FF] rounded font-light text-white hover:opacity-70"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        <div className="divider-wrapper relative flex items-center justify-center">
          <span className="flex-grow h-[0.5em] border-b border-[#c2c8d0]"></span>
          <span className="mx-2 text-white text-light">OR</span>
          <span className="flex-grow h-[0.5em] border-b border-[#c2c8d0]"></span>
        </div>
        {!loading && (
          <div className="p-10 pt-5 pt-0 rounded-lg text-center">
            <button
              onClick={() => handleOAuthSignIn('google')}
              className="flex flex-row w-full p-3 mb-3 border-solid border border-[#2F2F2F] text-gray-300 font-light rounded hover:bg-[#0000001a]"
            >
              <Image
                src="/googleLogo.svg"
                className="mr-4"
                alt="googleLogo"
                width={24}
                height={24}
                priority
              />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthSignIn('azure')}
              className="flex flex-row w-full p-3 mb-3 border-solid border border-[#2F2F2F] text-gray-300 font-light rounded hover:bg-[#0000001a]"
            >
              <Image
                src="/Microsoft_logo.svg"
                className="mr-4"
                alt="microsoftLogo"
                width={24}
                height={24}
                priority
              />
              Continue with Microsoft
            </button>
            <Link className="text-center text-gray-500" href={'./signUp'}>
              Don't have an account? Sign Up
            </Link>
          </div>
        )}
        </div>
        <footer className="text-gray-500">Nexus 2024 © </footer>
      </div>
  );
};

export default SignIn;
