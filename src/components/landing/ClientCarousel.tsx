"use client";

import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface ClientCarouselProps {
    children: React.ReactNode;
}

export default function ClientCarousel({ children }: ClientCarouselProps) {
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

    return (
        <Carousel className="w-full" plugins={[plugin.current]}>
            <CarouselContent className="-ml-1">
                {children}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}