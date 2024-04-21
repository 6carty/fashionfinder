import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { Occasion } from 'app/entities/enumerations/occasion.model';

export interface IOutfit {
  id: number;
  name?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  occasion?: Occasion | null;
  image?: string | null;
  imageContentType?: string | null;
  userCreated?: Pick<IUser, 'id'> | null;
  creator?: Pick<IUserProfile, 'id'> | null;
  clothingItems?: Pick<IClothingItem, 'id'>[] | null;
}

export type NewOutfit = Omit<IOutfit, 'id'> & { id: null };
