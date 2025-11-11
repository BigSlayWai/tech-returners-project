import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/file.svg" 
            width={128} 
            height={38}
            alt="Tech Returners Logo" 
          />
        </Link>

        <SignedIn>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/events/create" 
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Create Event
            </Link>
            <Link 
              href="/profile" 
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              My Profile
            </Link>
          </nav>
        </SignedIn>

        <div className="flex justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <div className="md:hidden">
              <MobileNav />
            </div>
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full text-white" size="lg">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header