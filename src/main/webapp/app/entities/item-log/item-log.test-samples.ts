import dayjs from 'dayjs/esm';

import { IItemLog, NewItemLog } from './item-log.model';

export const sampleWithRequiredData: IItemLog = {
  id: 76590,
  date: dayjs('2024-04-19T15:33'),
};

export const sampleWithPartialData: IItemLog = {
  id: 97810,
  date: dayjs('2024-04-19T15:30'),
};

export const sampleWithFullData: IItemLog = {
  id: 67372,
  date: dayjs('2024-04-18T22:27'),
};

export const sampleWithNewData: NewItemLog = {
  date: dayjs('2024-04-19T08:15'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
