"use client";

import type { AppBskyActorDefs } from "@atproto/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteQuest } from "@/app/actions/quest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface QuestCardProps {
  quest: {
    id: string;
    did: string;
    rkey?: string;
    title: string;
    description: string;
    achievement: string;
    createdAt: Date | { toDate: () => Date };
    updatedAt: Date | { toDate: () => Date };
    record?: string;
    status?: 'active' | 'completed' | 'archived';
  };
  author: AppBskyActorDefs.ProfileView | AppBskyActorDefs.ProfileViewDetailed | null | undefined;
}

export default function QuestCard({ quest, author, isOwner = false }: QuestCardProps & { isOwner?: boolean }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('本当にこのクエストを削除しますか？')) {
      try {
        await deleteQuest(quest.id!);
        toast.success('クエストを削除しました');
        router.refresh();
      } catch (error) {
        console.error('削除中にエラーが発生しました:', error);
        toast.error('削除に失敗しました');
      }
    }
  };
  // 日付を適切に処理
  const createdAt = quest.createdAt && typeof quest.createdAt === 'object' && 'toDate' in quest.createdAt 
    ? quest.createdAt.toDate() 
    : new Date(quest.createdAt as Date);

  // 著者情報のフォールバック
  const authorName = author?.displayName || 'Unknown Author';
  const authorDid = author?.did || quest.did;
  const authorAvatar = author?.avatar;
  const authorFallback = authorName.slice(0, 2).toUpperCase();

  return (
    <Card key={quest.rkey || quest.id} className="border-none shadow-lg">
      <CardHeader className="bg-gray-50 pb-4">
        <div>
          <div>
            <CardTitle className="text-2xl mb-2">{quest.title}</CardTitle>

            <div>
              <a
                href={`/profile/${authorDid}`}
                className="flex items-center my-2"
              >
                <Avatar>
                  {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
                  <AvatarFallback>{authorFallback}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-500 mx-2">
                  主催: {authorName}
                </p>
              </a>
            </div>
            <div className="text-sm text-gray-500">
              {createdAt.toLocaleString('ja-JP')}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-700 mb-4">概要: {quest.description}</p>
        <p className="text-gray-700 mb-4">報酬: {quest.achievement}</p>
      </CardContent>
      {isOwner && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/quest/edit/${quest.id}`)}
          >
            <Pencil className="h-4 w-4 mr-1" /> 編集
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" /> 削除
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
