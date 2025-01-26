import {
  CommitCreateEvent,
  CommitUpdateEvent,
  Jetstream,
} from "@skyware/jetstream";
import { prisma } from "@/lib/db/prisma";
import WebSocket from "ws";
import {
  AppVercelDekobokoPost,
  AppVercelDekobokoEvent,
} from "@/generated/api/index";
import { Agent } from "@atproto/api";

const agent = new Agent("https://public.api.bsky.app");

export const jetstream = new Jetstream({
  ws: WebSocket,
  wantedCollections: ["app.vercel.dekoboko.post", "app.vercel.dekoboko.event"],
});

jetstream.on("open", () => {
  console.log(`jetstream subscription started`);
});

jetstream.on("close", () => {
  console.log(`jetstream subscription closed`);
});

jetstream.on("error", (error) => {
  console.log(error);
});

async function updatePost(
  event:
    | CommitCreateEvent<"app.vercel.dekoboko.post">
    | CommitUpdateEvent<"app.vercel.dekoboko.post">
) {
  try {
    const record = event.commit.record;
    if (
      AppVercelDekobokoPost.isRecord(record) &&
      AppVercelDekobokoPost.validateRecord(record)
    ) {
      //作成者のプロフィールを取得
      const profile = await agent.getProfile({ actor: event.did });

      await prisma.post.upsert({
        where: {
          rkey: event.commit.rkey,
        },
        update: {
          text: record.text,
          record: JSON.stringify(record),
        },
        create: {
          rkey: event.commit.rkey,
          text: record.text,
          createdAt: new Date(),
          record: JSON.stringify(record),
          author: JSON.stringify(profile.data),
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

async function updateEvent(
  event:
    | CommitCreateEvent<"app.vercel.dekoboko.event">
    | CommitUpdateEvent<"app.vercel.dekoboko.event">
) {
  try {
    const record = event.commit.record;
    if (
      AppVercelDekobokoEvent.isRecord(record) &&
      AppVercelDekobokoEvent.validateRecord(record)
    ) {
      //作成者のプロフィールを取得
      const profile = await agent.getProfile({ actor: event.did });

      await prisma.event.upsert({
        where: {
          rkey: event.commit.rkey,
        },
        update: {
          text: record.title,
          description: record.description,
          achievement: record.achievement,
          record: JSON.stringify(record),
        },
        create: {
          rkey: event.commit.rkey,
          text: record.title,
          description: record.description,
          achievement: record.achievement,
          createdAt: new Date(),
          record: JSON.stringify(record),
          author: JSON.stringify(profile.data),
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

jetstream.onCreate("app.vercel.dekoboko.post", async (event) => {
  console.log(`New Post: ${event.commit.rkey}`);
  await updatePost(event);
});

jetstream.onUpdate("app.vercel.dekoboko.post", async (event) => {
  console.log(`Updated Post: ${event.commit.rkey}`);
  await updatePost(event);
});

jetstream.onDelete("app.vercel.dekoboko.post", async (event) => {
  console.log(`Deleted Post: ${event.commit.rkey}`);
  try {
    await prisma.post.delete({
      where: { rkey: event.commit.rkey },
    });
  } catch (e) {
    console.log(e);
  }
});

jetstream.onCreate("app.vercel.dekoboko.event", async (event) => {
  console.log(`New Event: ${event.commit.rkey}`);
  await updateEvent(event);
});

jetstream.onUpdate("app.vercel.dekoboko.event", async (event) => {
  console.log(`Updated Event: ${event.commit.rkey}`);
  await updateEvent(event);
});

jetstream.onDelete("app.vercel.dekoboko.event", async (event) => {
  console.log(`Deleted Event: ${event.commit.rkey}`);
  try {
    await prisma.event.delete({
      where: { rkey: event.commit.rkey },
    });
  } catch (e) {
    console.log(e);
  }
});
