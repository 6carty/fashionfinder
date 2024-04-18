import dayjs from 'dayjs/esm';

import { IItemLog, NewItemLog } from './item-log.model';

export const sampleWithRequiredData: IItemLog = {
  id: 32059,
  date: dayjs('2024-04-18T12:16'),
};

export const sampleWithPartialData: IItemLog = {
  id: 31001,
  date: dayjs('2024-04-18T13:08'),
};

export const sampleWithFullData: IItemLog = {
  id: 7463,
  date: dayjs('2024-04-18T03:41'),
};

export const sampleWithNewData: NewItemLog = {
  date: dayjs('2024-04-17T23:42'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
