import { IPost } from 'app/entities/post/post.model';

export interface ILeaderboard {
  id: number;
  profilePic?: string | null;
  profilePicContentType?: string | null;
  usersName?: string | null;
  likeCount?: number | null;
  position?: number | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewLeaderboard = Omit<ILeaderboard, 'id'> & { id: null };
