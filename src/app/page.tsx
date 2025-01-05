import { Card, CardContent } from "@/components/ui/card";
import { getSessionAgent } from "@/lib/auth/session";
import { Agent } from "@atproto/api";
import Image from "next/image";

export default async function Home() {
  const agent: Agent | null = await getSessionAgent();

  //認証チェック
  if (agent) {
    const profile = await agent.getProfile({ actor: agent.assertDid });

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Image
              src={profile.data.avatar!}
              alt="プロフィール画像"
              width={150}
              height={150}
              className="mx-auto rounded-full shadow-lg"
            />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              {profile.data.displayName}
            </h1>
          </div>

          <Card className="mb-8">
            <CardContent className="prose prose-lg max-w-none pt-6">
              <h2 className="text-2xl font-semibold mb-4">自己紹介</h2>
              <p>{profile.data.description}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return <p className="text-center">認証してください</p>;
}
