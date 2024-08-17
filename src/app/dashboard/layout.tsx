"use client";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CalendarClock, Cog, MenuIcon, PersonStanding } from "lucide-react";
import { useState } from "react";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { useParams, usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { UserButton } from "@clerk/nextjs";
import { ToggleTheme } from "@/components/layout/toggle-theme";
import { Button } from "@/components/ui/button";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Organization",
    href: "/dashboard/organization",
    icon: "employee",
    label: "organization",
  },
];

function SideBar() {
  const path = usePathname();
  const params = useParams();

  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {path.match("organization/") ? (
              <>
                <Button asChild variant={"ghost"}>
                  <Link href={`/dashboard/organization/${params.id}`}>
                    <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                      Organization
                    </h2>
                  </Link>
                </Button>

                <nav className="grid items-start gap-2">
                  <Link href={`/dashboard/organization/${params.id}/members`}>
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path.includes("members") ? "bg-accent" : "transparent"
                      )}
                    >
                      <PersonStanding className="mr-2 h-4 w-4" />
                      <span>Members</span>
                    </span>
                  </Link>
                  <Link href={`/dashboard/organization/${params.id}/events`}>
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path.includes("events") ? "bg-accent" : "transparent"
                      )}
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      <span>Events</span>
                    </span>
                  </Link>
                  <Link href={`/dashboard/organization/${params.id}/edit`}>
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path.includes("edit") ? "bg-accent" : "transparent"
                      )}
                    >
                      <Cog className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </span>
                  </Link>
                </nav>
              </>
            ) : (
              <DashboardNav items={navItems} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href="/dashboard" target="_blank">
            <div className="font-bold">
              <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
                NeatNGO
              </span>{" "}
            </div>
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ToggleTheme />
          {process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" && (
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          )}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "size-6",
              },
            }}
          />
        </div>
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <SideBar />
        <main className="w-full pt-16 px-2">{children}</main>
        <Toaster />
      </div>
    </>
  );
}
