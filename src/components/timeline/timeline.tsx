"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import PostCard from "@/components/timeline/post";
import TimelineFilter from "@/components/timeline/filter";
import { startOfDay, endOfDay } from "date-fns";
import { useState } from "react";
import { Post, PostType } from "@/types/post";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

interface TimelineProps {
  initialPosts: Post[];
  profile: ProfileView;
}

export default function Timeline({ initialPosts, profile }: TimelineProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [filterType, setFilterType] = useState<PostType | null>(null);
  const [filterDate, setFilterDate] = useState<Date | undefined>();

  const filterPosts = (posts: Post[], type: PostType | null, date: Date | undefined) => {
    return posts.filter((post) => {
      if (type && post.type !== type) {
        return false;
      }
      
      if (date) {
        const postDate = new Date(post.createdAt);
        const start = startOfDay(date);
        const end = endOfDay(date);
        if (postDate < start || postDate > end) {
          return false;
        }
      }
      
      return true;
    });
  };

  const handleFilterChange = (type: PostType | null, date: Date | undefined) => {
    setFilterType(type);
    setFilterDate(date);
    setPosts(filterPosts(initialPosts, type, date));
  };

  return (
    <div className="space-y-4">
      <TimelineFilter onFilterChange={handleFilterChange} />
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post.rkey}
              post={post}
              author={profile}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
