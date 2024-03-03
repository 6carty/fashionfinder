import dayjs from 'dayjs/esm';

import { Privacy } from 'app/entities/enumerations/privacy.model';

import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
  privacy: Privacy['PRIVATE'],
};

export const sampleWithPartialData: IUserProfile = {
  id: 857,
  firstName: 'Madilyn',
  lastName: 'Armstrong',
  profilePicture: '../fake-data/blob/hipster.png',
  profilePictureContentType: 'unknown',
  privacy: Privacy['PRIVATE'],
};

export const sampleWithFullData: IUserProfile = {
  id: 87530,
  firstName: 'Carey',
  lastName: 'Weber',
  profilePicture: '../fake-data/blob/hipster.png',
  profilePictureContentType: 'unknown',
  lastSeen: dayjs('2024-03-03T09:36'),
  location: 'Cliffs leverage',
  privacy: Privacy['PUBLIC'],
};

export const sampleWithNewData: NewUserProfile = {
  privacy: Privacy['PRIVATE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
