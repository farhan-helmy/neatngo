"use client";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { formatDate } from "@/helper";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user || process.env.ENVIRONMENT === "dev") {
    return (
      <Layout>
        <LayoutHeader>Welcome back!</LayoutHeader>
        <LayoutBody>You are using a demo account.</LayoutBody>
      </Layout>
    );
  }

  return (
    <Layout>
      <LayoutHeader>Welcome back!</LayoutHeader>
      <LayoutBody>
        Last signed in at {formatDate(user.lastSignInAt!)}
      </LayoutBody>
    </Layout>
  );
}
