"use client";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button, buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, LogIn, Menu, UserRound } from "lucide-react";
import { ToggleTheme } from "@/components/layout/toggle-theme";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/#features",
    label: "Features",
  },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();

  if(pathname.includes("dashboard")) {
    return null;
  }
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              NeatNGO
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ToggleTheme />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                />
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">NeatNGO</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            {process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" ? (
              <Link href={"dashboard"}>
                <Button>Sign In Demo</Button>
              </Link>
            ) : (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant={"ghost"}>
                      <LogIn className="size-5" />
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    aria-label="Dashboard"
                  >
                    <Link aria-label="Dashboard" href="/dashboard">
                      <LayoutDashboard className="size-5" />
                    </Link>
                  </Button>
                </SignedIn>
              </>
            )}

            <ToggleTheme />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
