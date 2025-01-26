import { getSessionAgent } from "@/lib/auth/session";
import { Agent } from "@atproto/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { post } from "./actions/post";
import { prisma } from "@/lib/db/prisma";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export default async function Home() {
  const agent: Agent | null = await getSessionAgent();

  if (agent) {
    const posts = await prisma.post.findMany();

    const profile = await agent.getProfile({ actor: agent.assertDid });

    return (
      <div>
        <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
          <Card className="border-2">
            <form action={post}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={profile.data.avatar} />
                    <AvatarFallback>avatar</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold">新規投稿</div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="text"
                  placeholder="いまどうしてる？"
                  className="min-h-[100px]"
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">投稿する</Button>
              </CardFooter>
            </form>
          </Card>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {posts.map((post) => {
                const author: ProfileView = JSON.parse(post.author);

                return (
                  <Card key={post.rkey} className="border">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={author.avatar} />
                          <AvatarFallback>{author.displayName}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {author.displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.createdAt.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{post.text}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }
}
