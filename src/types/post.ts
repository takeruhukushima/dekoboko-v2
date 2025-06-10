export type PostType = 'totu' | 'boko';

export interface Post {
  id: string;
  text: string;
  type: PostType;
  createdAt: Date | string;
  updatedAt?: Date | string;
  userId: string;
  userDid: string;  // ユーザーのDID
  userHandle: string;
  userDisplayName: string;
  userAvatar?: string;
  status?: 'active' | 'deleted';
}

export interface AppVercelDekobokoPostRecord {
  text: string;
  type: PostType;
  createdAt: string;
}
