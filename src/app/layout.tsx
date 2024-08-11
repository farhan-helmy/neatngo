import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeatNGO - Efficient NGO Management System",
  description:
    "Ditch excel sheets and streamline your NGO operations with our comprehensive management solution.",
  openGraph: {
    title: "NeatNGO - Efficient NGO Management System",
    description:
      "Ditch excel sheets and streamline your NGO operations with our comprehensive management solution.",
    type: "website",
    url: "https://neatngo.com",
    images: [
      {
        url: "https://neatngo.com/og",
        width: 1200,
        height: 630,
        alt: "NeatNGO Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeatNGO - Efficient NGO Management System",
    description:
      "Ditch excel sheets and streamline your NGO operations with our comprehensive management solution.",
    images: ["https://neatngo.com/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-br" suppressHydrationWarning>
        <body className={cn("", inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
