"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import hashPass from "@/lib/hashing";

interface userRegistrationSchema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default async function register({
  firstName,
  lastName,
  email,
  password,
}: userRegistrationSchema) {
  try {
    if (!password) {
      throw new Error("Password is required");
    }

    let hashedPassword;

    try {
      hashedPassword = await hashPass(password);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      throw new Error("Failed to process password");
    }

    const res = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    if (!res || res.length === 0) {
      throw new Error("Failed to insert user into database");
    }

    return { success: true, userId: res[0].id };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
}
