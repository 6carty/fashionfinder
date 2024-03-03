import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IChatroom {
  id: number;
  name?: string | null;
  icon?: string | null;
  iconContentType?: string | null;
  userProfiles?: Pick<IUserProfile, 'id'>[] | null;
}

export type NewChatroom = Omit<IChatroom, 'id'> & { id: null };
