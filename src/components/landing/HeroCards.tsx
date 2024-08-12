import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      <Image
        src={"/landingpage.gif"}
        width={700}
        height={500}
        layout="responsive"
        className="rounded-md"
        alt={"gif"}
      />
    </div>
  );
};
