"use server";

import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { validateUserCredentials } from "./validation";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { handleApiRequest } from "@/helper";
import { db } from "@/db";
import { emailVerificationCodes, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { Resend } from "resend"
import VerificationEmail from "@/components/emails/verificationEmail"
import { validateRequest } from "@/lib/auth";
import { isWithinExpirationDate } from "oslo";



export async function loginPublicUser({
    username,
    password,
}: {
    username: string;
    password: string;
}) {
    return handleApiRequest(async () => {
        const result = validateUserCredentials({
            email: username,
            password,
        });

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, result.email),
        });
        if (!existingUser || existingUser.password === null) {
            // NOTE:
            // Returning immediately allows malicious actors to figure out valid usernames from response times,
            // allowing them to only focus on guessing passwords in brute-force attacks.
            // As a preventive measure, you may want to hash passwords even for invalid usernames.
            // However, valid usernames can be already be revealed with the signup page among other methods.
            // It will also be much more resource intensive.
            // Since protecting against this is non-trivial,
            // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
            // If usernames are public, you may outright tell the user that the username is invalid.
            throw new Error("User does not exists");
        }

        const validPassword = await verify(existingUser.password, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });
        if (!validPassword) {
            throw new Error("Invalid password");
        }

        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        return existingUser;
    });
}

export async function registerPublicUser({
    firstName,
    lastName,
    username,
    password,
    eventId,
    phoneNumber,
}: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    eventId: string;
    phoneNumber: string;
}) {
    return handleApiRequest(async () => {
        const result = validateUserCredentials({
            email: username,
            password,
        });

        const passwordHash = await hash(result.password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });

        const userId = generateIdFromEntropySize(10);

        const userResult = await db.transaction(async (tx) => {
            const checkUserExists = await tx.query.users.findFirst({
                where: eq(users.email, result.email),
            });

            if (checkUserExists) {
                throw new Error("Username already exists, please login");
            }

            const user = await tx
                .insert(users)
                .values({
                    id: userId,
                    firstName,
                    lastName,
                    email: result.email,
                    password: passwordHash,
                    phoneNumber,
                })
                .returning({
                    id: users.id,
                    email: users.email,
                    emailVerified: users.emailVerified,
                });

            if (!user.length) {
                throw new Error("Failed to create user");
            }

            return user[0];
        });

        const code = await generateEmailVerificationCode({
            userId: userResult.id,
            email: result.email,
        });

        const emailRes = await sendEmailVerificationCode({
            code,
            email: result.email,
        });

        if (emailRes.error) {
            throw new Error("Failed to send email verification code");
        }

        const session = await lucia.createSession(userResult.id, {
            username: userResult.email,
        });

        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        return userResult;
    });
}

async function generateEmailVerificationCode({ userId, email }: { userId: string, email: string }) {
    return await db.transaction(async (tx) => {
        // Delete existing verification code
        await tx.delete(emailVerificationCodes)
            .where(and(
                eq(emailVerificationCodes.userId, userId),
                eq(emailVerificationCodes.email, email)
            ));

        const code = generateRandomString(8, alphabet("0-9"));
        await tx.insert(emailVerificationCodes).values({
            code,
            userId,
            email,
            expiresAt: createDate(new TimeSpan(15, "m"))
        });

        return code;
    });
}

async function sendEmailVerificationCode({ email, code }: { email: string, code: string }) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const res = await resend.emails.send({
        from: 'verification@neatngo.com',
        to: email,
        subject: 'Neatngo Verification Code',
        react: VerificationEmail({ verificationCode: code }),
    });

    return res

}

export async function verifyVerificationCode({ code }: { code: string }) {
    return handleApiRequest(async () => {
        const user = await validateRequest()
        console.log(user)

        if (!user || !user.user?.id) {
            throw new Error("Unauthorized");
        }

        const verificationCode = await db.transaction(async (tx) => {
            const verificationCode = await tx.query.emailVerificationCodes.findFirst({
                where: and(
                    eq(emailVerificationCodes.userId, user.user.id),
                    eq(emailVerificationCodes.code, code)
                )
            });

            if (!verificationCode) {
                throw new Error("Invalid verification code");
            }

            if (!isWithinExpirationDate(verificationCode.expiresAt)) {
                throw new Error("Verification code expired");
            }

            await tx.update(users)
                .set({ emailVerified: true })
                .where(eq(users.id, user.user.id));

            await tx.delete(emailVerificationCodes)
                .where(eq(emailVerificationCodes.id, verificationCode.id));

            return verificationCode;
        });

        return verificationCode;
    });


}