"use client";

import { Button } from "@/components/ui/button";
import { paymentFailed, paymentSuccess } from "./actions";
import { useSearchParams } from "next/navigation";

export default function DummyPaymentPage() {
  const searchParams = useSearchParams();

  return (
    <div className="xl:py-12 xl:px-72 py-4 px-2 flex">
      <div className="flex gap-2 justify-center items-center">
        <Button
          className="bg-green-500"
          onClick={async () => {
            await paymentSuccess({
              id: searchParams.get("id")!,
            });
          }}
        >
          Success
        </Button>
        <Button
          className="bg-red-500"
          onClick={() => {
            paymentFailed();
          }}
        >
          Failed
        </Button>
      </div>
    </div>
  );
}
