import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
  content: 'Coordinator',
  createdDate: dayjs('2024-03-02T17:45'),
};

export const sampleWithPartialData: IComment = {
  id: 34202,
  content: 'Baby New',
  createdDate: dayjs('2024-03-03T11:56'),
};

export const sampleWithFullData: IComment = {
  id: 37490,
  content: 'circuit Health',
  createdDate: dayjs('2024-03-02T14:57'),
};

export const sampleWithNewData: NewComment = {
  content: 'Investment Macedonia Creative',
  createdDate: dayjs('2024-03-02T15:34'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
