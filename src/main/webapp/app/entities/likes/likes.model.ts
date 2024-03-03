import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ILikes {
  id: number;
  like?: boolean | null;
  likedAt?: dayjs.Dayjs | null;
  post?: Pick<IPost, 'id'> | null;
  userLiked?: Pick<IUserProfile, 'id'> | null;
}

export type NewLikes = Omit<ILikes, 'id'> & { id: null };
