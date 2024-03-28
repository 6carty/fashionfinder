import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IExchangeRequest {
  id: number;
  image?: string | null;
  imageContentType?: string | null;
  description?: string | null;
  clothingItem?: Pick<IClothingItem, 'id' | 'name'> | null;
  creater?: Pick<IUserProfile, 'id'> | null;
  requester?: Pick<IUserProfile, 'id'> | null;
}

export type NewExchangeRequest = Omit<IExchangeRequest, 'id'> & { id: null };
