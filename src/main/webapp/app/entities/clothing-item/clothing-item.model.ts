import dayjs from 'dayjs/esm';
import { IEvent } from 'app/entities/event/event.model';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { ClothingType } from 'app/entities/enumerations/clothing-type.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IClothingItem {
  id: number;
  name?: string | null;
  type?: ClothingType | null;
  clothingImg?: string | null;
  clothingImgContentType?: string | null;
  description?: string | null;
  clothingSize?: string | null;
  colour?: string | null;
  style?: string | null;
  brand?: string | null;
  material?: string | null;
  status?: Status | null;
  lastWorn?: dayjs.Dayjs | null;
  event?: Pick<IEvent, 'id'> | null;
  outfits?: Pick<IOutfit, 'id'>[] | null;
  owner?: Pick<IUserProfile, 'id'> | null;
}

export type NewClothingItem = Omit<IClothingItem, 'id'> & { id: null };
