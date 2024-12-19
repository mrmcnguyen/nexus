'use client'
import Image from 'next/image'
import Link from 'next/link';
import ProjectsDashboard from './projectsDashboard';
import { Suspense } from 'react';
import Loading from './Loading';

export default function CreateTeamPage() {
  
  return (
    <main className="flex h-full flex-col">
        {/* Logo */}
      <div className='flex flex-row w-full justify-center'>
      <Image
                src="/nexusLogo.png"
                width={200}
                height={20}
                alt="Nexus Logo"
                priority
            />
        </div>
    <div className='flex flex-col w-full h-full items-center justify-center'>
     <Suspense fallback={<Loading />}>
      <ProjectsDashboard/>
      </Suspense>
    </div>  
    </main>
  )
}