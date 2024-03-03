import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IPost {
  id: number;
  caption?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  createdDate?: dayjs.Dayjs | null;
  editedDate?: dayjs.Dayjs | null;
  totalLikes?: number | null;
  author?: Pick<IUserProfile, 'id'> | null;
}

export type NewPost = Omit<IPost, 'id'> & { id: null };
