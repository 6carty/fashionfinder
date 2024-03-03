import { IChatroom, NewChatroom } from './chatroom.model';

export const sampleWithRequiredData: IChatroom = {
  id: 45756,
  name: 'Reverse-engineered Maldives',
};

export const sampleWithPartialData: IChatroom = {
  id: 42501,
  name: 'Incredible',
  icon: '../fake-data/blob/hipster.png',
  iconContentType: 'unknown',
};

export const sampleWithFullData: IChatroom = {
  id: 72618,
  name: 'deliverables connecting',
  icon: '../fake-data/blob/hipster.png',
  iconContentType: 'unknown',
};

export const sampleWithNewData: NewChatroom = {
  name: 'Refined',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
