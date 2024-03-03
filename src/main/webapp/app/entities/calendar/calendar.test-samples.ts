import dayjs from 'dayjs/esm';

import { ICalendar, NewCalendar } from './calendar.model';

export const sampleWithRequiredData: ICalendar = {
  id: 70069,
  currentWeek: dayjs('2024-03-02T19:50'),
};

export const sampleWithPartialData: ICalendar = {
  id: 70714,
  currentWeek: dayjs('2024-03-03T04:11'),
  calendarConnected: 'Utah bifurcated',
  calendarSync: dayjs('2024-03-03T10:46'),
};

export const sampleWithFullData: ICalendar = {
  id: 36545,
  currentWeek: dayjs('2024-03-02T18:38'),
  calendarConnected: 'state Wooden markets',
  calendarSync: dayjs('2024-03-02T18:12'),
};

export const sampleWithNewData: NewCalendar = {
  currentWeek: dayjs('2024-03-02T17:27'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
