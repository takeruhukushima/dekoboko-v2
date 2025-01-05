import { Jetstream } from "@skyware/jetstream";
import WebSocket from "ws";

export const jetstream = new Jetstream({
  ws: WebSocket,
  wantedCollections: ["app.vercel.decoboko.post"],
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

jetstream.onCreate("app.vercel.decoboko.post", async (event) => {
  console.log(`New Post: ${event.commit.rkey}`);
});

jetstream.onUpdate("app.vercel.decoboko.post", async (event) => {
  console.log(`Updated Post: ${event.commit.rkey}`);
});

jetstream.onDelete("app.vercel.decoboko.post", async (event) => {
  console.log(`Deleted Post: ${event.commit.rkey}`);
});
