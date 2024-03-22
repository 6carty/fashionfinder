import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IChatroom } from 'app/entities/chatroom/chatroom.model';

export interface IChatMessage {
  id: number;
  content?: string | null;
  timestamp?: dayjs.Dayjs | null;
  image?: string | null;
  imageContentType?: string | null;
  sender?: Pick<IUser, 'id'> | null;
  chatroom?: Pick<IChatroom, 'id'> | null;
}

export type NewChatMessage = Omit<IChatMessage, 'id'> & { id: null };
