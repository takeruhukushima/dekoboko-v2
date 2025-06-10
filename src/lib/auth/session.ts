import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { Agent } from "@atproto/api";
import { createClient } from "@/lib/auth/client";
import { SessionData, sessionOptions } from "@/lib/session";

export async function getSessionAgent() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.did) return null;

    const client = await createClient();
    const oauthSession = await client.restore(session.did);
    
    if (!oauthSession) {
      console.warn("No OAuth session found for DID:", session.did);
      return null;
    }
    
    return new Agent(oauthSession);
  } catch (err) {
    console.error("Error in getSessionAgent:", err);
    return null;
  }
}
