import dayjs from 'dayjs/esm';
import { IWeather } from 'app/entities/weather/weather.model';
import { IRating } from 'app/entities/rating/rating.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { Occasion } from 'app/entities/enumerations/occasion.model';

export interface IOutfit {
  id: number;
  name?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  occasion?: Occasion | null;
  weather?: Pick<IWeather, 'id'> | null;
  rating?: Pick<IRating, 'id'> | null;
  creator?: Pick<IUserProfile, 'id'> | null;
  clothingItems?: Pick<IClothingItem, 'id'>[] | null;
}

export type NewOutfit = Omit<IOutfit, 'id'> & { id: null };
