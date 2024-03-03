import dayjs from 'dayjs/esm';
import { IMilestoneType } from 'app/entities/milestone-type/milestone-type.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IUserMilestone {
  id: number;
  currentProgress?: number | null;
  completed?: boolean | null;
  unlockedDate?: dayjs.Dayjs | null;
  milestoneType?: Pick<IMilestoneType, 'id'> | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewUserMilestone = Omit<IUserMilestone, 'id'> & { id: null };
