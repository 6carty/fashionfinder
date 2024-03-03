import { IRating } from 'app/entities/rating/rating.model';

export interface ITrendingOutfit {
  id: number;
  name?: string | null;
  description?: string | null;
  rating?: Pick<IRating, 'id'> | null;
}

export type NewTrendingOutfit = Omit<ITrendingOutfit, 'id'> & { id: null };
