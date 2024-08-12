import { Button } from "@/components/custom/MovingBorder";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import { PhoneCall } from "lucide-react";
import { FlipWords } from "../custom/FlipWords";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export const Hero = () => {
  const words = ["donors", "volunteers", "projects"];

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-5xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              NeatNGO
            </span>{" "}
          </h1>
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              - NGO Management System
            </span>{" "}
          </h2>
        </main>

        <div className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Ditch the spreadsheets, Streamline your NGO operations with NeatNGO,
          Manage
          <FlipWords words={words} />
          all in one place
        </div>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                borderRadius="1rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
              >
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button
                borderRadius="1rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
              >
                Get Started
              </Button>
            </Link>
          </SignedIn>

          <a
            rel="noreferrer noopener"
            href="mailto:farhan@neatngo.com"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Contact us
            <PhoneCall className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
