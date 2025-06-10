import { getSessionAgent } from "@/lib/auth/session";
import { Agent } from "@atproto/api";
import { getPosts } from "@/lib/firevase";
import PostForm from "@/components/home/postForm";
import Timeline from "@/components/timeline/timeline";
import { redirect } from "next/navigation";

export default async function Home() {
  const agent: Agent | null = await getSessionAgent();

  if (!agent) {
    redirect("/login");
  }

  // Get posts from Firestore
  const posts = await getPosts();
  
  // Get user profile from AT Protocol
  const profile = await agent.getProfile({ actor: agent.assertDid });

  return (
    <div className="relative min-h-screen">
      <div className="w-full max-w-2xl mx-auto p-4 pb-24">
        <Timeline initialPosts={posts} profile={profile.data} />
      </div>
      <div className="fixed bottom-20 right-6">
        <PostForm profile={profile.data} />
      </div>
    </div>
  );
}
