'use client'
import Image from 'next/image'
import Link from 'next/link';
import MultiStageForm from './multiStageForm'
import { FiGrid, FiHome, FiUser } from 'react-icons/fi';

export default function CreateTeamPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* Logo */}
      {/* <div className='absolute top-5 left-5'>
        <Image
          src="/nexusLogo.png"
          width={200}
          height={20}
          alt="Nexus Logo"
          priority
        />
        <div className='flex flex-col text-center mb-4'>
          <div className='text-center'>
          <Link href="../dashboard" className={`relative flex h-10 mb-2 w-full items-center justify-center rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-[#91C8FF]`}>
          <button className="bg-gray-600 text-gray-400 mx-2 p-4 rounded-lg hover:text-[#91C8FF]">
            <FiHome />
          </button>
          </Link>
          <Link href="../dashboard" className={`relative flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-[#91C8FF]`}>
          <button className="bg-gray-600 text-gray-400 mx-2 p-4 rounded-lg hover:text-[#91C8FF]">
            <FiUser />
          </button>
          </Link>
          </div>
        </div>
      </div> */}
      <div className='flex flex-col w-full items-center justify-center'>
        <MultiStageForm/>
      </div>  
    </main>
  )
}