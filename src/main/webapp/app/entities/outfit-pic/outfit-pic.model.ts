import { IOutfit } from 'app/entities/outfit/outfit.model';

export interface IOutfitPic {
  id: number;
  image?: string | null;
  imageContentType?: string | null;
  outfit?: Pick<IOutfit, 'id'> | null;
}

export type NewOutfitPic = Omit<IOutfitPic, 'id'> & { id: null };
