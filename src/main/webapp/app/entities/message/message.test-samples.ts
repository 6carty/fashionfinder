import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 29027,
  content: 'turn-key SQL Oklahoma',
  timeStamp: dayjs('2024-03-03T02:28'),
};

export const sampleWithPartialData: IMessage = {
  id: 76000,
  content: 'invoice',
  timeStamp: dayjs('2024-03-02T16:43'),
  messageImage: '../fake-data/blob/hipster.png',
  messageImageContentType: 'unknown',
};

export const sampleWithFullData: IMessage = {
  id: 56535,
  content: 'Customer action-items',
  timeStamp: dayjs('2024-03-03T07:10'),
  messageImage: '../fake-data/blob/hipster.png',
  messageImageContentType: 'unknown',
};

export const sampleWithNewData: NewMessage = {
  content: 'cross-platform',
  timeStamp: dayjs('2024-03-02T20:05'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
