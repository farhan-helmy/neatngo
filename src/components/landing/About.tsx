"use client";
import React from "react";
import { Boxes } from "@/components/custom/BackgroundBoxes";
import { cn } from "@/lib/utils";

export const About = () => {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
        <span className="font-bold inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
          About NeatNGO
        </span>
      </h1>
      <p className="text-center mt-2 text-neutral-300 relative z-20 px-60">
        NeatNGO is a cutting-edge management system designed specifically for
        non-governmental organizations. Our platform empowers NGOs to streamline
        their operations, from member management to event planning, allowing
        them to focus more on their mission and less on administrative tasks.
        With features like Excel import, multi-organization support, and
        intuitive user interfaces, NeatNGO is the all-in-one solution for modern
        NGOs looking to maximize their impact.
      </p>
    </div>
  );
};

{
  /* <section id="about" className="container py-24 sm:py-32">
  <div className="bg-muted/50 border rounded-lg py-12">
    <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
      <div className="flex flex-col justify-between">
        <div className="pb-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              About{" "}
            </span>
            NGOMS
          </h2>
          <p className="text-xl text-muted-foreground mt-4">
            NGOMS is a cutting-edge management system designed specifically
            for non-governmental organizations. Our platform empowers NGOs
            to streamline their operations, from member management to event
            planning, allowing them to focus more on their mission and less
            on administrative tasks. With features like Excel import,
            multi-organization support, and intuitive user interfaces, NGOMS
            is the all-in-one solution for modern NGOs looking to maximize
            their impact.
          </p>
        </div>
      </div>
    </div>
  </div>
</section> */
}
