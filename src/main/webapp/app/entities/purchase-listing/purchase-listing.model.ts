import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IPurchaseListing {
  id: number;
  itemForSale?: number | null;
  price?: number | null;
  seller?: Pick<IUserProfile, 'id'> | null;
}

export type NewPurchaseListing = Omit<IPurchaseListing, 'id'> & { id: null };
