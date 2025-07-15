import { SignedIn, SignedOut, SignIn, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';


import React from 'react'
import { Button } from './ui/button';
import { LayoutDashboard, PenBox } from 'lucide-react';

const Header = () => {
  return (
    <div className=' w-full bg-white/80 backdrop-blur-md z-50 shadow border-b'>
        <nav className="flex items-center justify-between px-4 py-4">
            <Link href = "/"> 
                <Image src = {"/logo.png"}
                alt = "fintrack logo"
                height = "60"
                width = "200"
                className = "h-12 w-auto object-contain"
                /> 
            </Link>
          <div>

            <SignedIn>
                <Link href={"/dashboard"} className='text-grey-600 hover:text-blue-600 flex items-center gap-2'>
                <Button variant={"outline"}>
                    <LayoutDashboard size={18}/>
                    <span className='hidden md:inline'>Dashboard</span>
                </Button>
                </Link>

                <Link href={"/transaction/create"} className='text-grey-600 hover flex items-center gap-2'>
                <Button>
                    <PenBox size={18}/>
                    <span className='hidden md:inline'>Add Transaction</span>
                </Button>
                </Link>
            </SignedIn>

            <SignedOut>
            <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant={"outline"} className={"flex items-center gap-2"}> Login </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </nav>
    </div>
  )
}

export default Header;
