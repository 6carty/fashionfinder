import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ICalendar {
  id: number;
  currentWeek?: dayjs.Dayjs | null;
  calendarConnected?: string | null;
  calendarSync?: dayjs.Dayjs | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewCalendar = Omit<ICalendar, 'id'> & { id: null };
