export interface IMilestoneType {
  id: number;
  name?: string | null;
  initialTarget?: number | null;
  nextTarget?: number | null;
}

export type NewMilestoneType = Omit<IMilestoneType, 'id'> & { id: null };
