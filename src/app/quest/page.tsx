"use server";
import { QuestForm } from "@/components/quest/form";
import type { AppBskyActorDefs } from "@atproto/api";
import { getSessionAgent } from "@/lib/auth/session";
import { getQuests } from "@/app/actions/quest";
import QuestCard from "@/components/quest/card";

interface QuestWithAuthor {
  id: string;
  did: string;
  rkey?: string;  // オプショナルに変更
  title: string;
  description: string;
  achievement: string;
  createdAt: Date | { toDate: () => Date };
  updatedAt: Date | { toDate: () => Date };
  record?: string;  // オプショナルに変更
  author?: AppBskyActorDefs.ProfileViewDetailed | null;
  userId?: string;
  status?: 'active' | 'completed' | 'archived';
}

// FirestoreのTimestampをDateに変換するヘルパー関数
const toDate = (date: Date | { toDate: () => Date }): Date => {
  return date && typeof date === 'object' && 'toDate' in date 
    ? date.toDate() 
    : new Date(date as Date);
};

export default async function Quest() {
  const agent = await getSessionAgent();

  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-12 pb-24 max-w-5xl relative min-h-screen">
        <div className="text-center py-12 text-gray-500">
          ログインが必要です
        </div>
      </div>
    );
  }

  try {
    // Firestoreからクエストを取得
    const quests = await getQuests();

    // 著者情報を並列に取得
    const questsWithAuthor: QuestWithAuthor[] = await Promise.all(
      quests.map(async (quest) => {
        try {
          const author = await agent.getProfile({
            actor: quest.did,
          });
          return { ...quest, author: author.data };
        } catch (error) {
          console.error(`Failed to fetch author for ${quest.did}:`, error);
          return { ...quest, author: null };
        }
      })
    );

    return (
      <div className="container mx-auto px-4 py-12 pb-24 max-w-5xl relative min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-zen font-bold">クエスト一覧</h1>
        </div>

        <div className="space-y-8">
          {questsWithAuthor.map((quest) => {
            // 日付を適切に処理
            const createdAt = toDate(quest.createdAt);
            
            // 必要なプロパティを持つオブジェクトを作成
            const questData = {
              ...quest,
              createdAt,
              updatedAt: toDate(quest.updatedAt),
              // 必要なプロパティをマッピング
              rkey: quest.rkey || quest.id,
              record: quest.record || '',
              // デフォルトの著者情報を追加
              author: quest.author || {
                did: quest.did || '',
                handle: '',
                displayName: 'Unknown',
                avatar: '',
                viewer: {},
                labels: []
              }
            };

            return (
              <QuestCard 
                key={quest.id} 
                quest={questData} 
                author={questData.author} 
                isOwner={questData.did === agent?.did}
              />
            );
          })}
          
          {quests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              クエストがまだ作成されていません
            </div>
          )}
        </div>
        
        {/* フローティングアクションボタン */}
        <div className="fixed bottom-24 right-6 z-10">
          <QuestForm />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading quests:', error);
    return (
      <div className="container mx-auto px-4 py-12 pb-24 max-w-5xl relative min-h-screen">
        <div className="text-center py-12 text-red-500">
          クエストの読み込み中にエラーが発生しました
        </div>
      </div>
    );
  }
}
