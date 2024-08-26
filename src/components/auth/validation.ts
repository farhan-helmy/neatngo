import { z } from "zod";

const userCredentialsSchema = z.object({
  email: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(31, "Username must be at most 31 characters long")
    .email("Invalid email format")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(255, "Password must be at most 255 characters long"),
});

export function validateUserCredentials(input: {
  email: string;
  password: string;
}) {
  try {
    return userCredentialsSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map((err) => err.message).join(", "));
    }
    throw error;
  }
}
