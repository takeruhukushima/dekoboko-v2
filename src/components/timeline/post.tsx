import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { Post } from "@prisma/client";

export default function PostCard({
  post,
  author,
}: {
  post: Post & { type: "totu" | "boko" };
  author: ProfileView;
}) {
  return (
    <Card key={post.rkey} className="border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <a
            className="flex items-center space-x-4"
            href={`/profile/${author.did}`}
          >
            <Avatar>
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.displayName}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{author.displayName}</div>
              <div className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </a>
          <Badge variant={post.type === "totu" ? "default" : "destructive"}>
            {post.type === "totu" ? "凸" : "凹"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{post.text}</p>
      </CardContent>
    </Card>
  );
}
