import { db } from ".";
import { users } from "./schema";

export async function seedDemoUser() {
    try {
        await db.insert(users).values({
            email: "demouser@neatngo.com",
            firstName: "Demo",
            lastName: "User",
        })
    } catch (err) {
        console.log(err)
        throw new Error("Failed to seed demo user")
    }
}

seedDemoUser().then(() => {
    console.log("Demo user seeded")
})
    .finally(() => {
        process.exit(0)
    })