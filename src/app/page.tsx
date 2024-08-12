import { About } from "@/components/landing/About";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <ScrollToTop />
    </>
  );
}
