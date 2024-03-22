import { IUser } from 'app/entities/user/user.model';

export interface IChatroom {
  id: number;
  name?: string | null;
  creator?: Pick<IUser, 'id'> | null;
  recipient?: Pick<IUser, 'id'> | null;
}

export type NewChatroom = Omit<IChatroom, 'id'> & { id: null };
