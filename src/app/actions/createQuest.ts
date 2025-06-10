"use server";

import { createQuest as createFirestoreQuest } from "./quest";
import { redirect } from "next/navigation";

export async function createQuest(formData: FormData) {
  try {
    await createFirestoreQuest(formData);
    redirect("/quest");
  } catch (error) {
    console.error("Error in createQuest:", error);
    throw error; // エラーはクライアント側でハンドリング
  }
}
