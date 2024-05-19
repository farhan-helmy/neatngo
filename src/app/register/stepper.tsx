import {
  BackpackIcon,
  HeartIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

export function Stepper({ step }: { step: "one" | "two" | "three" | "four" }) {
  return (
    <div className="flex flex-row justify-between px-9 items-center relative">
      <div className="w-10 h-10 bg-pink-500 rounded-full p-1 z-10">
        <PersonIcon className="text-white h-full w-full" />
      </div>
      <div
        className={`w-10 h-10 rounded-full p-1 z-10 ${
          step !== "two" && step !== "three"
            ? "bg-white border-pink-500 border-2"
            : "bg-pink-500"
        }`}
      >
        <HomeIcon
          className={`h-full w-full ${
            step !== "two" && step !== "three" ? "text-black" : "text-white"
          }`}
        />
      </div>
      <div
        className={`w-10 h-10 rounded-full p-1 z-10 ${
          step !== "three"
            ? "bg-white border-pink-500 border-2 "
            : "bg-pink-500"
        }`}
      >
        <BackpackIcon
          className={`h-full w-full ${
            step !== "three" ? "text-black" : "text-white"
          }`}
        />
      </div>
      <div
        className={`w-10 h-10 rounded-full p-1 z-10 ${
          step !== "four" ? "bg-white border-pink-500 border-2" : "bg-pink-500"
        }`}
      >
        <HeartIcon
          className={`h-full w-full ${step !== "four" ? "text-black" : ""}`}
        />
      </div>
      <div className="absolute left-0 right-0 h-0.5 bg-pink-400 top-1/2 transform -translate-y-1/2"></div>
    </div>
  );
}
