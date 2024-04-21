import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IOutfit } from 'app/entities/outfit/outfit.model';

export interface IRating {
  id: number;
  ratedAt?: dayjs.Dayjs | null;
  userRated?: Pick<IUser, 'id'> | null;
  outfit?: Pick<IOutfit, 'id'> | null;
}

export type NewRating = Omit<IRating, 'id'> & { id: null };
