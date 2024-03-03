import dayjs from 'dayjs/esm';

import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
  caption: 'Fantastic',
  createdDate: dayjs('2024-03-02'),
};

export const sampleWithPartialData: IPost = {
  id: 79841,
  caption: 'Future recontextualize',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  createdDate: dayjs('2024-03-02'),
  totalLikes: 32531,
};

export const sampleWithFullData: IPost = {
  id: 10489,
  caption: 'infrastructure olive synthesizing',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  createdDate: dayjs('2024-03-03'),
  editedDate: dayjs('2024-03-02'),
  totalLikes: 65666,
};

export const sampleWithNewData: NewPost = {
  caption: 'programming Denar withdrawal',
  createdDate: dayjs('2024-03-02'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
