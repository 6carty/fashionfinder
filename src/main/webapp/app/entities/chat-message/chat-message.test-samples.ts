import dayjs from 'dayjs/esm';

import { IChatMessage, NewChatMessage } from './chat-message.model';

export const sampleWithRequiredData: IChatMessage = {
  id: 16788,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-21T20:07'),
};

export const sampleWithPartialData: IChatMessage = {
  id: 94931,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-21T19:07'),
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IChatMessage = {
  id: 1607,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-21T10:04'),
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewChatMessage = {
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-21T04:19'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
