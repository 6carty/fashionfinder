import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  title: 'Cotton',
  dateTime: dayjs('2024-03-03T00:21'),
};

export const sampleWithPartialData: IEvent = {
  id: 14349,
  title: 'Home',
  dateTime: dayjs('2024-03-02T22:27'),
};

export const sampleWithFullData: IEvent = {
  id: 38618,
  title: 'withdrawal',
  location: 'wireless',
  dateTime: dayjs('2024-03-02T22:15'),
  endTime: dayjs('2024-03-03T12:18'),
};

export const sampleWithNewData: NewEvent = {
  title: 'generating Tuna coherent',
  dateTime: dayjs('2024-03-03T11:41'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
