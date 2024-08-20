import { eq } from "drizzle-orm";
import { db } from ".";
import { organizations } from "./schema";

async function updateSlug() {
    try{
        const orgs = await db.select().from(organizations)

        for (const org of orgs) {
            const slug = org.name.toLowerCase().replace(/\s/g, "-")
            await db.update(organizations).set({ uniqueSlug: slug }).where(eq(organizations.id, org.id))
        }
    } catch (error) {      
        console.error(error);
    }
}

updateSlug()
.then(() => console.log("done"))
.catch((e) => console.error(e))
.finally(() => process.exit(0))