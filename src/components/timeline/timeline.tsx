"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import PostCard from "@/components/timeline/post";
import TimelineFilter from "@/components/timeline/filter";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { Post, PostType } from "@/types/post";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

// Helper to ensure consistent date parsing
const parseDate = (date: string | Date): Date => {
  if (date instanceof Date) return date;
  try {
    return parseISO(date);
  } catch (e) {
    console.error('Error parsing date:', e);
    return new Date();
  }
};

interface TimelineProps {
  initialPosts: Post[];
  profile: ProfileView;
}

export default function Timeline({ initialPosts, profile }: TimelineProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterType, setFilterType] = useState<PostType | null>(null);
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  // Only run filters on the client side to avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true);
    setPosts(initialPosts);
  }, [initialPosts]);

  const filterPosts = (postsToFilter: Post[], type: PostType | null, date: Date | undefined) => {
    if (!isMounted) return [];
    
    return postsToFilter.filter((post) => {
      if (type && post.type !== type) {
        return false;
      }
      
      if (date) {
        try {
          const postDate = parseDate(post.createdAt);
          const start = startOfDay(date);
          const end = endOfDay(date);
          return postDate >= start && postDate <= end;
        } catch (e) {
          console.error('Error parsing date:', e);
          return false;
        }
      }
      
      return true;
    });
  };

  const handleFilterChange = (type: PostType | null, date: Date | undefined) => {
    if (!isMounted) return;
    
    setFilterType(type);
    setFilterDate(date);
    setPosts(filterPosts(initialPosts, type, date));
  };

  const totuPosts = posts.filter(post => post.type === 'totu');
  const filteredPosts = filterPosts(posts, filterType, filterDate);

  return (
    <div className="space-y-4">
      <TimelineFilter
        filterType={filterType}
        setFilterType={setFilterType}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
      />
      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              profile={{
                did: post.userId,
                handle: post.userHandle,
                displayName: post.userDisplayName,
                avatar: post.userAvatar
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
