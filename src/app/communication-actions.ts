"use server";
import { sendInvite } from "../lib/db/commQueries";

// Communication/Invitation Server Actions

export async function sendInviteAction(senderId: string, customMessage: string, recipientEmail: string, projectId: string, projectName: string, organisationName: string, recipientId: string, senderName: string) {
  return await sendInvite(senderId, customMessage, recipientEmail, projectId, projectName, organisationName, recipientId, senderName);
}
