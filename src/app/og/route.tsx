import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import OGImage from "@/components/seo/OgImage";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const fontData = await fetch(
      new URL("../../../public/assets/Inter-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(<OGImage />, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    });
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
