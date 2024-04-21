import dayjs from 'dayjs/esm';

import { IRating, NewRating } from './rating.model';

export const sampleWithRequiredData: IRating = {
  id: 92458,
  ratedAt: dayjs('2024-03-02T15:25'),
};

export const sampleWithPartialData: IRating = {
  id: 38329,
  ratedAt: dayjs('2024-03-02T21:26'),
};

export const sampleWithFullData: IRating = {
  id: 48944,
  ratedAt: dayjs('2024-03-03T04:36'),
};

export const sampleWithNewData: NewRating = {
  ratedAt: dayjs('2024-03-03T04:40'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
