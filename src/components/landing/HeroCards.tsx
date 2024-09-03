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
        unoptimized
      />
    </div>
  );
};
