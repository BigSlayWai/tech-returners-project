import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs"

const Header = () => {
  return (
    <header className="w-full border-b">
        <div className="wrapper mx-auto flex h-16 items-center justify-between">
            <Link href="/" className="w-36 text-lg font-bold">
            <Image 
            src="/assets/images/logo.svg" alt="logo" width={144} height={32} 
            alt="Tech Returners Events Platform Logo"
            />
            </Link>
            <div className="flex w-32 justify-end gap-3">
            <SignedOut>
              <SignInButton>
                <Button className="rounded-full" size="lg">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            </div>
        </div>
        </header>
  )
}

export default Header