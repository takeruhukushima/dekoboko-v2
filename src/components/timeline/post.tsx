"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { deletePost } from "@/app/actions/post";
import { Post } from "@/types/post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PostCard({
  post,
  profile,
}: {
  post: Post;
  profile: { 
    did: string;
    handle?: string;
    displayName?: string;
    avatar?: string;
  };
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const postDate = new Date(post.createdAt);
  const displayName = post.userDisplayName || post.userHandle || '匿名ユーザー';
  const isOwner = post.userDid === profile.did;

  const handleDelete = async () => {
    if (!confirm('本当にこの投稿を削除しますか？')) return;
    
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success('投稿を削除しました');
      router.refresh();
    } catch (error) {
      console.error('削除中にエラーが発生しました:', error);
      toast.error('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className={`border-l-4 ${post.type === 'totu' ? 'border-l-blue-500' : 'border-l-red-500'} hover:shadow-md transition-shadow`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.userAvatar} alt={displayName} />
              <AvatarFallback>{displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{displayName}</div>
              <div className="text-xs text-muted-foreground">
                {postDate.toLocaleString()}
              </div>
            </div>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">メニューを開く</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/post/edit/${post.id}`} className="cursor-pointer flex items-center">
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>編集</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>削除中...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>削除</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="whitespace-pre-line">{post.text}</div>
        <div className="mt-2">
          <Badge variant={post.type === 'totu' ? 'default' : 'destructive'}>
            {post.type === 'totu' ? '凸' : '凹'}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
        <span>投稿日時: {postDate.toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
}
