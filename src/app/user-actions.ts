"use server";
import { getUserFullName } from "../lib/db/userQueries";

// User Management Server Actions

export async function getUserFullNameAction(userId: string) {
  return await getUserFullName(userId);
}
