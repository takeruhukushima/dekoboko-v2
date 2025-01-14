import { Card, CardContent } from "@/components/ui/card";
import { getSessionAgent } from "@/lib/auth/session";
import { Agent } from "@atproto/api";
import Image from "next/image";

export default async function Home() {
  const agent: Agent | null = await getSessionAgent();

  //認証チェック
  if (agent) {
    const profile = await agent.getProfile({ actor: agent.assertDid });

    return <div></div>;
  }
}
