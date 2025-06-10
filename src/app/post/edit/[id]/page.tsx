"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getPostById, updatePost } from "@/lib/firevase";
import { Post } from "@/types/post";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    type: "totu" as "totu" | "boko",
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const postData = await getPostById(id as string);
        if (!postData) {
          toast.error("投稿が見つかりませんでした");
          router.push("/");
          return;
        }
        
        setPost(postData);
        setFormData({
          text: postData.text,
          type: postData.type,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("投稿の取得中にエラーが発生しました");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    try {
      setIsSubmitting(true);
      
      await updatePost(post.id, {
        text: formData.text,
        type: formData.type,
      });
      
      toast.success("投稿を更新しました");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("投稿の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p>投稿が見つかりませんでした</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">投稿を編集</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">本文</Label>
          <Textarea
            id="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="min-h-[200px]"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>タイプ</Label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="totu"
                checked={formData.type === 'totu'}
                onChange={() => setFormData({ ...formData, type: 'totu' })}
                className="h-4 w-4 text-blue-600"
              />
              <span>凸</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="boko"
                checked={formData.type === 'boko'}
                onChange={() => setFormData({ ...formData, type: 'boko' })}
                className="h-4 w-4 text-red-600"
              />
              <span>凹</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.text.trim()}
          >
            {isSubmitting ? "更新中..." : "更新する"}
          </Button>
        </div>
      </form>
    </div>
  );
}
