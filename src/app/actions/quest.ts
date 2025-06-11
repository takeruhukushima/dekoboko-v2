"use server";

import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { getSessionAgent } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export interface Quest {
  id?: string;
  did: string;       // ユーザーDID
  rkey?: string;     // レコードキー
  title: string;
  description: string;
  achievement: string;
  createdAt: any;   // Firestoreのタイムスタンプ
  updatedAt: any;    // Firestoreのタイムスタンプ
  userId: string;    // ユーザーID (DID)
  record?: string;   // 元のレコードデータ (JSON文字列)
  status?: 'active' | 'completed' | 'archived';
}

type WithId<T> = T & { id: string };

/**
 * クエスト一覧を取得する
 */
export async function getQuests(): Promise<WithId<Quest>[]> {
  try {
    const agent = await getSessionAgent();
    if (!agent) {
      redirect("/login");
    }

    const q = query(
      collection(db, "quests"),
      where("userId", "==", agent.did),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const quests: WithId<Quest>[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      quests.push({
        id: doc.id,
        did: data.did || data.userId, // didがなければuserIdを使用
        rkey: data.rkey || doc.id,    // rkeyがなければdoc.idを使用
        title: data.title,
        description: data.description,
        achievement: data.achievement,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt || data.createdAt, // updatedAtがなければcreatedAtを使用
        userId: data.userId,
        record: data.record || '',
        status: data.status || 'active',
      } as WithId<Quest>);
    });

    return quests;
  } catch (error) {
    console.error("Error getting quests: ", error);
    throw new Error("クエストの取得中にエラーが発生しました");
  }
}

/**
 * 新しいクエストを作成する
 */
export async function createQuest(formData: FormData) {
  try {
    const agent = await getSessionAgent();
    if (!agent) {
      redirect("/login");
    }

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const achievement = formData.get("achievement")?.toString();

    if (!title || !description || !achievement) {
      throw new Error("必要な情報が入力されていません");
    }

    const newQuest = {
      title,
      description,
      achievement,
      userId: agent.did,
      status: 'active' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "quests"), newQuest);
    console.log("Document written with ID: ", docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("クエストの作成中にエラーが発生しました");
  }
}

/**
 * クエストを更新する
 */
export async function updateQuest(questId: string, data: Partial<Quest>) {
  try {
    const agent = await getSessionAgent();
    if (!agent) {
      redirect("/login");
    }

    const questRef = doc(db, "quests", questId);
    const questDoc = await getDoc(questRef);

    if (!questDoc.exists()) {
      throw new Error("クエストが見つかりません");
    }

    const questData = questDoc.data() as Quest;
    
    // 自分のクエストか確認
    if (questData.userId !== agent.did) {
      throw new Error("権限がありません");
    }

    await updateDoc(questRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    throw new Error("クエストの更新中にエラーが発生しました");
  }
}

/**
 * クエストを削除する
 */
export async function deleteQuest(questId: string) {
  try {
    const agent = await getSessionAgent();
    if (!agent) {
      redirect("/login");
    }

    const questRef = doc(db, "quests", questId);
    const questDoc = await getDoc(questRef);

    if (!questDoc.exists()) {
      throw new Error("クエストが見つかりません");
    }

    const questData = questDoc.data() as Quest;
    
    // 自分のクエストか確認
    if (questData.userId !== agent.did) {
      throw new Error("権限がありません");
    }

    await deleteDoc(questRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw new Error("クエストの削除中にエラーが発生しました");
  }
}
