import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  title: 'Cotton',
  location: 'Steel red',
  dateTime: dayjs('2024-03-02T19:08'),
};

export const sampleWithPartialData: IEvent = {
  id: 58638,
  title: 'Metal teal',
  location: 'Rubber SAS Officer',
  dateTime: dayjs('2024-03-03T06:51'),
};

export const sampleWithFullData: IEvent = {
  id: 26951,
  title: 'Barbuda',
  location: 'bus',
  dateTime: dayjs('2024-03-02T16:43'),
};

export const sampleWithNewData: NewEvent = {
  title: 'generation fuchsia',
  location: 'Dalasi',
  dateTime: dayjs('2024-03-03T03:32'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
