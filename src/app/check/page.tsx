import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function checkPage() {
  const checkUser = async () => {
    const { sessionClaims } = auth();

    if (!sessionClaims) return;
    const res = await db
      .select()
      .from(users)
      .where(eq(users.email, sessionClaims?.email as string));

    if (res.length === 0) {
      const user = await db
        .insert(users)
        .values({
          email: sessionClaims?.email as string,
          role: "ORG_OWNER",
        })
        .returning({
          id: users.id,
        });

      if (user.length === 0) {
        throw new Error("Failed to create user");
      }

      return redirect("/dashboard");
    }

    return redirect("/dashboard");
  };
  await checkUser();
  return (
    <div className="h-screen flex items-center justify-center">
      <div>loading...</div>
    </div>
  );
}
