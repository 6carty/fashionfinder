import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IOutfit } from 'app/entities/outfit/outfit.model';

export interface IItemLog {
  id: number;
  date?: dayjs.Dayjs | null;
  owner?: Pick<IUser, 'id'> | null;
  outfit?: IOutfit | null;
}

export type NewItemLog = Omit<IItemLog, 'id'> & { id: null };
