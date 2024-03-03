import dayjs from 'dayjs/esm';
import { IChatroom } from 'app/entities/chatroom/chatroom.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IMessage {
  id: number;
  content?: string | null;
  timeStamp?: dayjs.Dayjs | null;
  messageImage?: string | null;
  messageImageContentType?: string | null;
  chatroom?: Pick<IChatroom, 'id'> | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
