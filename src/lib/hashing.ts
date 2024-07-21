const bcrypt = require("bcrypt");

export default async function hashPass(unhashPass: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(unhashPass, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}
