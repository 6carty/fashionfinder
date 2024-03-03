import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IChatroom } from 'app/entities/chatroom/chatroom.model';
import { Privacy } from 'app/entities/enumerations/privacy.model';

export interface IUserProfile {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  profilePictureContentType?: string | null;
  lastSeen?: dayjs.Dayjs | null;
  location?: string | null;
  privacy?: Privacy | null;
  user?: Pick<IUser, 'id'> | null;
  chatrooms?: Pick<IChatroom, 'id'>[] | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
