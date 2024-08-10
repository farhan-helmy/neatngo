import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverEffect } from "../custom/CardHoverEffect";

interface FeatureProps {
  title: string;
  description: string;
  link: string;
}

const features: FeatureProps[] = [
  {
    title: "Excel Import",
    description:
      "Easily import existing users from Excel spreadsheets, streamlining your transition to NeatNGO.",
    link: "",
  },
  {
    title: "Member Management",
    description:
      "Create and manage members effortlessly. Keep track of donor information, volunteer details, and more.",
    link: "",
  },
  {
    title: "Event Organization",
    description:
      "Plan and manage events with ease. From scheduling to attendee tracking, all in one place.",
    link: "",
  },
  {
    title: "Multi-Organization Support",
    description:
      "Create and manage multiple organizations within a single platform. Perfect for umbrella NGOs or federated structures.",
    link: "",
  },
];

const featureList: string[] = [
  "Dark/Light theme",
  "Excel import",
  "Member management",
  "Event planning",
  "Multi-org support",
  "Responsive design",
  "User-friendly interface",
  "Data analytics",
  "Customizable",
];

export const Features = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Powerful{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          NGO Management Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={features} />
      </div>
    </section>
  );
};
