import { createClient } from "../../../lib/auth/client";
import { Hono } from "hono";
import { getIronSession } from "iron-session";
import { handle } from "hono/vercel";
import { sessionOptions, SessionData } from "@/lib/session";

const app = new Hono().basePath("/api");

// Create client for OAuth
let client: any = null;

try {
  client = await createClient();
} catch (error) {
  console.error("Failed to create OAuth client:", error);
}

declare module "iron-session" {
  interface IronSessionData extends SessionData {}
}

app.get("/oauth/callback", async (c) => {
  if (!client) {
    console.error("OAuth client not initialized");
    return c.redirect("/login?error=server_error");
  }

  const params = new URLSearchParams(c.req.url.split("?")[1]);
  
  try {
    const { session: authSession } = await client.callback(params);
    
    if (!authSession?.did) {
      console.error("No DID in auth session");
      return c.redirect("/login?error=auth_failed");
    }
    
    // Get the existing session
    const clientSession = await getIronSession<SessionData>(c.req.raw, c.res, sessionOptions);
    
    // Update session data
    clientSession.did = authSession.did;
    clientSession.isLoggedIn = true;
    
    // Save the session
    await clientSession.save();
    
    return c.redirect("/");
  } catch (err) {
    console.error("OAuth callback failed:", err);
    return c.redirect("/login?error=auth_failed");
  }
});

export const GET = handle(app);
