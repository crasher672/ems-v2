"use server"

import * as z from "zod";

import { EmergencyContactSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { auditAction } from "./auditAction";

export const addEmergencyContact = async (userId: string, values: z.infer<typeof EmergencyContactSchema>) => {
    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized!" };
    }

    const validatedFields = EmergencyContactSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const dbUser = await getUserById(userId);
    if (!dbUser) {
        return { error: "User not found in database!" };
    }

    // Check if the user already has an emergency contact
    const existingEmergencyContact = await db.emergencyContact.findFirst({
        where: { userId: dbUser.id },
    });

    if (existingEmergencyContact) {
        return { error: "User already has an emergency contact!" };
    }

    const { firstName, middleName, lastName, emailAddress, relationship, contactNumber } = validatedFields.data;

    await auditAction(dbUser.id, "User Emergency Contact Add");

    await db.emergencyContact.create({
        data: {
            firstName,
            middleName,
            lastName,
            relationship,
            contactNumber,
            emailAddress,
            userId: dbUser?.id,
        },
    });

    return { success: "Emergency contact added!" };
}