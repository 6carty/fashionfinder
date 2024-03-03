import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ISaleListing {
  id: number;
  itemForSale?: number | null;
  price?: number | null;
  seller?: Pick<IUserProfile, 'id'> | null;
}

export type NewSaleListing = Omit<ISaleListing, 'id'> & { id: null };
