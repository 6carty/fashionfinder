import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';

export interface IClothingPic {
  id: number;
  image?: string | null;
  imageContentType?: string | null;
  clothingItem?: Pick<IClothingItem, 'id'> | null;
}

export type NewClothingPic = Omit<IClothingPic, 'id'> & { id: null };
