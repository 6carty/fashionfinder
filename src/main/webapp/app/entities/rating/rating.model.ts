export interface IRating {
  id: number;
  rating?: number | null;
}

export type NewRating = Omit<IRating, 'id'> & { id: null };
