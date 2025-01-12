import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/xrpc");

app.get("/", async (c) => {
  return c.text("This is a decoboko AppView Server.");
});

export const GET = handle(app);
