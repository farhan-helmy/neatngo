"use client";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Button } from "@/components/ui/button";

import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user || process.env.ENVIRONMENT === "dev") {
    return (
      <Layout>
        <LayoutHeader className="font-light"> {format(new Date(), 'PPpp')}</LayoutHeader>
        <LayoutBody className="flex flex-col items-center mt-12">
          <div className="text-4xl text-center font-bold">
            Welcome to NeatNGO Admin
          </div>
          <Link href="/dashboard/organization" className="pt-4">
            <Button>Get Started</Button>
          </Link>
        </LayoutBody>
      </Layout>
    );
  }

  return (
    <Layout>
      <LayoutHeader>Welcome back!</LayoutHeader>
      <LayoutBody>
        <div className="text-4xl text-center font-bold">Welcome</div>
      </LayoutBody>
    </Layout>
  );
}
