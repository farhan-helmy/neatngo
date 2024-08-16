"use client";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { formatDate } from "@/helper";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "dev") {
    return (
      <Layout>
        <LayoutHeader>Welcome back!</LayoutHeader>
        <LayoutBody>You are using a demo account.</LayoutBody>
      </Layout>
    );
  }
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <LayoutHeader>Welcome back!</LayoutHeader>
      <LayoutBody>
        {/* {isDemo()
          ? "You are using a demo account."
          : `Last signed in at ${formatDate(user.lastSignInAt!)}`} */}
      </LayoutBody>
    </Layout>
  );
}
