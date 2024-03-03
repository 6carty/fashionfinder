import dayjs from 'dayjs/esm';

import { ILikes, NewLikes } from './likes.model';

export const sampleWithRequiredData: ILikes = {
  id: 9651,
};

export const sampleWithPartialData: ILikes = {
  id: 66827,
};

export const sampleWithFullData: ILikes = {
  id: 43577,
  like: false,
  likedAt: dayjs('2024-03-03T07:02'),
};

export const sampleWithNewData: NewLikes = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
