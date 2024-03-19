import { IOutfit } from 'app/entities/outfit/outfit.model';

export interface IRating {
  id: number;
  rating?: number | null;
  outfit?: Pick<IOutfit, 'id'> | null;
}

export type NewRating = Omit<IRating, 'id'> & { id: null };
