import { Layout, LayoutBody } from "@/components/custom/layout";
import Image from "next/image";

export default function ViewNgoPage({params}: {params: {orgId: string}}){
    return (
        <Layout className="flex items-center justify-center">
            <LayoutBody>
                <div className="pt-12">
                    
                <Image
                    src={`/assets/ngoplaceholder.png`}
                    alt={`ngo name`}
                    width={96}
                    height={96}
                    className="rounded-full w-24 h-24 aspect-square object-cover"
                  />
                </div>
            </LayoutBody>
        </Layout>
    )
}