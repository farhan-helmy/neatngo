import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import ClientCarousel from "./ClientCarousel";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

interface SocialNetworksProps {
  name: string;
  url: string;
}

const socialNetworks: SocialNetworksProps[] = [
  {
    name: "Linkedin",
    url: "https://www.linkedin.com/",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/",
  },
];

const socialIcon = (iconName: string) => {
  switch (iconName) {
    case "Linkedin":
      return <Linkedin size="20" />;
    case "Facebook":
      return <Facebook size="20" />;
    case "Instagram":
      return <Instagram size="20" />;
  }
};

export async function PublicOrganizationsCaorusel() {
  const publicOrganizations = await db.transaction(async (tx) => {
    const list = await tx
      .select({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
      })
      .from(organizations)
      .where(eq(organizations.isPublic, true));
    return list;
  });

  if (!publicOrganizations || publicOrganizations.length === 0) {
    return null;
  }

  return (
    <section id="team" className="container py-24 sm:py-32">
      <h2 className="text-3xl text-center md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Public{" "}
        </span>
        NGOs
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground text-center">
        Here are some of the public NGOs that are using our platform.
      </p>
      <ClientCarousel>
        {publicOrganizations.map(({ id, name, description }) => (
          <CarouselItem key={id} className="px-3 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Link href={`/ngo/${name}`}>
                <Card className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center">
                  <CardHeader className="mt-8 flex justify-center items-center pb-2">
                    <Image
                      src={`/assets/ngoplaceholder.png`}
                      alt={`${name}`}
                      width={96}
                      height={96}
                      className="absolute -top-8 rounded-full w-24 h-24 aspect-square object-cover"
                    />
                    <CardTitle className="text-center pt-4">{name}</CardTitle>
                  </CardHeader>

                  <CardContent className="text-sm text-center py-2">
                    <p>{description}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </ClientCarousel>
    </section>
  );
}
