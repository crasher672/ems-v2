"use server"
import * as z from "zod";

import { db } from "@/lib/db";
import { UpdateDocumentsSchema } from "@/schemas";
import { auditAction } from "./auditAction";
import { currentUser } from "@/lib/auth";


export async function updateDocuments(values: z.infer<typeof UpdateDocumentsSchema>) {

    const user = await currentUser()
    if (!user) {
        return { error: "Not a User" }
    }

    const validatedFields = UpdateDocumentsSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid Fields!" }
    }

    const { documentName, documentType, id } = validatedFields.data

    await db.documents.update({
        where: {
            id
        },
        data: {
            documentName,
            documentType
        }
    })

    await auditAction(user.id, "User Updated Document")
    return { success: "Document Updated!" }
}