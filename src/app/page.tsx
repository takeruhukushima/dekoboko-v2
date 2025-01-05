import { getSessionAgent } from "@/lib/auth/session";
import { Agent } from "@atproto/api";

export default async function Home() {
  const agent: Agent | null = await getSessionAgent();

  if (agent) {
    return <div>{agent.assertDid}</div>;
  }

  return <p>認証してください</p>;
}
