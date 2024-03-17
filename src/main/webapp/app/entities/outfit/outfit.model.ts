import dayjs from 'dayjs/esm';
import { IRating } from 'app/entities/rating/rating.model';
import { IEvent } from 'app/entities/event/event.model';
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
  rating?: Pick<IRating, 'id'> | null;
  event?: Pick<IEvent, 'id'> | null;
  creator?: Pick<IUserProfile, 'id'> | null;
  clothingItems?: Pick<IClothingItem, 'id'>[] | null;
}

export type NewOutfit = Omit<IOutfit, 'id'> & { id: null };
