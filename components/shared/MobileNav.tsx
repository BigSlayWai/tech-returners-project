"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Separator } from "../ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MobileNav = () => {
  const pathname = usePathname()
  
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image 
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/images/file.svg" width={128} height={38} alt="Tech Returners" />
          </Link>
          <Separator className="border border-gray-50" />
          <div className="flex flex-col gap-3">
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-primary-500' : ''} font-medium transition-colors`}
            >
              Home
            </Link>
            <Link 
              href="/events/create" 
              className={`${pathname === '/events/create' ? 'text-primary-500' : ''} font-medium transition-colors`}
            >
              Create Event
            </Link>
            <Link 
              href="/profile" 
              className={`${pathname === '/profile' ? 'text-primary-500' : ''} font-medium transition-colors`}
            >
              My Profile
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default MobileNav