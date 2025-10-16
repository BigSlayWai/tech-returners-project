import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import Link from "next/link";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        {/* Trigger for opening the mobile navigation */}
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>

        {/* Mobile navigation content */}
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          {/* Logo */}
          <Image
            src="/assets/images/file.svg"
            alt="logo"
            width={128}
            height={38}
          />

          {/* Separator */}
          <Separator className="border border-gray-50" />

          {/* Navigation Items */}
          <div className="flex flex-col gap-4">
            <Link href="/events" className="text-gray-700 hover:text-gray-900">
              Events
            </Link>
            <Link href="/events/create" className="text-gray-700 hover:text-gray-900">
              Create Event
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-gray-900">
              My Profile
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;