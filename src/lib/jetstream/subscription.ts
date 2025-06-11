import {
  CommitCreateEvent,
  CommitUpdateEvent,
  Jetstream,
} from "@skyware/jetstream";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import WebSocket from "ws";
import {
  AppVercelDekobokoPost,
  AppVercelDekobokoQuest,
} from "@/generated/api/index";

export const jetstream = new Jetstream({
  ws: WebSocket,
  wantedCollections: ["app.vercel.dekoboko.post", "app.vercel.dekoboko.quest"],
});

jetstream.on("open", () => {
  console.log(`jetstream subscription started`);
});

jetstream.on("close", () => {
  console.log(`jetstream subscription closed`);
});

jetstream.on("error", (error) => {
  console.log("Jetstream error:", error);
});

interface CommitEvent {
  commit: {
    cid: { toString(): string };
    author: string;
    rkey: string;
    operation: 'create' | 'update' | 'delete';
    record: any;
  };
}

async function updatePost(
  event: CommitEvent & {
    commit: {
      record: any;
      operation: 'create' | 'update' | 'delete';
    };
  }
) {
  try {
    const record = event.commit.record;
    if (
      AppVercelDekobokoPost.isRecord(record) &&
      AppVercelDekobokoPost.validateRecord(record)
    ) {
      const postId = event.commit.cid?.toString() || event.commit.rkey;
      const postRef = doc(db, "posts", postId);
      const postData: Record<string, any> = {
        text: record.text,
        type: record.type,
        did: event.commit.author,
        rkey: event.commit.rkey,
        record: JSON.stringify(record),
        updatedAt: serverTimestamp(),
      };

      if (event.commit.operation === 'create') {
        postData.createdAt = serverTimestamp();
      }

      await setDoc(postRef, postData, { merge: true });
      console.log(`Synced post to Firestore: ${postId}`);
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

async function updateEvent(
  event: CommitEvent & {
    commit: {
      record: any;
      operation: 'create' | 'update' | 'delete';
    };
  }
) {
  try {
    const record = event.commit.record;
    if (
      AppVercelDekobokoQuest.isRecord(record) &&
      AppVercelDekobokoQuest.validateRecord(record)
    ) {
      const questId = event.commit.cid?.toString() || event.commit.rkey;
      const questRef = doc(db, "quests", questId);
      const questData: Record<string, any> = {
        title: record.title,
        description: record.description,
        achievement: record.achievement,
        did: event.commit.author,
        rkey: event.commit.rkey,
        record: JSON.stringify(record),
        updatedAt: serverTimestamp(),
      };

      if (event.commit.operation === 'create') {
        questData.createdAt = serverTimestamp();
      }

      await setDoc(questRef, questData, { merge: true });
      console.log(`Synced quest to Firestore: ${questId}`);
    }
  } catch (error) {
    console.error("Error updating quest:", error);
  }
}

// イベントハンドラの型を適切に扱うためのヘルパー関数
const handlePostEvent = async (event: any) => {
  console.log(`Post ${event.commit.operation}: ${event.commit.rkey}`);
  try {
    await updatePost({
      ...event,
      commit: {
        ...event.commit,
        author: event.commit.author || event.commit.did || 'unknown',
        cid: event.commit.cid || { toString: () => event.commit.rkey },
      },
    });
  } catch (error) {
    console.error('Error handling post event:', error);
  }
};

const handleQuestEvent = async (event: any) => {
  console.log(`Quest ${event.commit.operation}: ${event.commit.rkey}`);
  try {
    await updateEvent({
      ...event,
      commit: {
        ...event.commit,
        author: event.commit.author || event.commit.did || 'unknown',
        cid: event.commit.cid || { toString: () => event.commit.rkey },
      },
    });
  } catch (error) {
    console.error('Error handling quest event:', error);
  }
};

// イベントハンドラを登録
jetstream.onCreate("app.vercel.dekoboko.post", handlePostEvent);
jetstream.onUpdate("app.vercel.dekoboko.post", handlePostEvent);
jetstream.onCreate("app.vercel.dekoboko.quest", handleQuestEvent);
jetstream.onUpdate("app.vercel.dekoboko.quest", handleQuestEvent);

// 削除イベントの処理
jetstream.onDelete("app.vercel.dekoboko.post", async (event: any) => {
  console.log(`Deleted Post: ${event.commit.rkey}`);
  try {
    const postRef = doc(db, "posts", event.commit.rkey);
    await setDoc(
      postRef, 
      { 
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, 
      { merge: true }
    );
  } catch (error) {
    console.error("Error marking post as deleted:", error);
  }
});

jetstream.onDelete("app.vercel.dekoboko.quest", async (event: any) => {
  console.log(`Deleted Quest: ${event.commit.rkey}`);
  try {
    const questRef = doc(db, "quests", event.commit.rkey);
    await setDoc(
      questRef, 
      { 
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, 
      { merge: true }
    );
  } catch (error) {
    console.error("Error marking quest as deleted:", error);
  }
});
