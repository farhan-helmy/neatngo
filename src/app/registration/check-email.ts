import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from 'drizzle-orm';

export async function checkEmail(email: string): Promise<boolean> {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    return existingUser.length === 0; 
  } catch (error) {
    console.error('Error checking email:', error);
    throw new Error('Failed to check email');
  }
}