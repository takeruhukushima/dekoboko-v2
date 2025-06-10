"use server";

import { getSessionAgent } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { addPost, deletePost } from "@/lib/firevase";

export { deletePost };
import { revalidatePath } from "next/cache";

export async function post(formData: FormData) {
  try {
    const content = formData.get("text") as string;
    const type = formData.get("type") as "totu" | "boko";
    const agent = await getSessionAgent();

    if (!agent) {
      redirect("/login");
    }

    if (!content) {
      throw new Error("テキストが入力されていません。");
    }

    if (!type || !["totu", "boko"].includes(type)) {
      throw new Error("投稿タイプが正しく選択されていません。");
    }

    // Get user profile from AT Protocol
    const profile = await agent.getProfile({ actor: agent.assertDid });
    
    if (!profile.success) {
      throw new Error("ユーザー情報の取得に失敗しました。");
    }

    // Save to Firestore
    await addPost({
      text: content,
      type,
      userId: agent.assertDid,
      userDid: agent.assertDid, // Add userDid
      userHandle: profile.data.handle || '',
      userDisplayName: profile.data.displayName || profile.data.handle || '',
      userAvatar: profile.data.avatar || ''
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}
