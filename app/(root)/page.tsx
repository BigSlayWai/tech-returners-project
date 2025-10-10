import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from "next/image";

export default function Home() {
  return (
    <>
    <section className="bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 bg-dotted-pattern bg-cover py-12 md:py-24">
      <div className="wrapper grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
        <div className="flex flex-col justify-center gap-6 md:gap-8">
          <h1 className="h1 text-[hsl(var(--foreground))]">Welcome To Tech Returners</h1>
          <p className="p text-[hsl(var(--muted-foreground))]">
            Discover our events and join the journey to upskill and grow.
          </p>
          <Button size="lg" asChild className="btn-primary w-full sm:w-auto">
            <Link href="#events" scroll={false}>Explore Now</Link>
          </Button>
        </div>

        <div className="hexagon-frame">
          <Image 
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="object-cover"
          />
        </div>
      </div>
    </section>
    </>
  );
}
