import { Card, CardContent } from "@/components/ui/card";
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
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { post } from "./actions/post";

export default async function Home() {
  const agent: Agent | null = await getSessionAgent();

  if (agent) {
    const profile = await agent.getProfile({ actor: agent.assertDid });

    return (
      <div>
        <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
          <Card className="border-2">
            <form action={post}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>UN</AvatarFallback>
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
              {posts.map((post) => (
                <Card key={post.id} className="border">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{post.author}</div>
                        <div className="text-sm text-gray-500">
                          {post.timestamp}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{post.content}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-4 text-gray-500">
                      <Button variant="ghost" size="sm" className="space-x-2">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }
}
