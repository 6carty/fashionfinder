import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IFashionTip {
  id: number;
  title1?: string | null;
  description1?: string | null;
  author?: Pick<IUserProfile, 'id'> | null;
}

export type NewFashionTip = Omit<IFashionTip, 'id'> & { id: null };
