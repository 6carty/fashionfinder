import dayjs from 'dayjs/esm';

import { IUserMilestone, NewUserMilestone } from './user-milestone.model';

export const sampleWithRequiredData: IUserMilestone = {
  id: 7052,
  currentProgress: 90834,
  completed: false,
};

export const sampleWithPartialData: IUserMilestone = {
  id: 48691,
  currentProgress: 76313,
  completed: false,
  unlockedDate: dayjs('2024-03-03T02:06'),
};

export const sampleWithFullData: IUserMilestone = {
  id: 21367,
  currentProgress: 9804,
  completed: true,
  unlockedDate: dayjs('2024-03-02T22:48'),
};

export const sampleWithNewData: NewUserMilestone = {
  currentProgress: 48093,
  completed: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
