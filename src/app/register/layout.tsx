import Image from "next/image";

function Header() {
  return (
    <header className="grid grid-cols-3 py-2 px-2">
      <div>
        <Image
          src={
            "https://mrds.org.my/wp-content/uploads/2022/08/cropped-MRDS2023_EN_Transparent-Logo.png"
          }
          width={100}
          height={100}
          alt="MRDS Logo"
        />
      </div>
      <div>
        <h1></h1>
      </div>

      <div></div>
    </header>
  );
}

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <body suppressHydrationWarning={true}>{children}</body>
    </>
  );
}
