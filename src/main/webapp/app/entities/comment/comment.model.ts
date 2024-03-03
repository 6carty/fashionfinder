import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IComment {
  id: number;
  content?: string | null;
  createdDate?: dayjs.Dayjs | null;
  postCommented?: Pick<IPost, 'id'> | null;
  userCommented?: Pick<IUserProfile, 'id'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
