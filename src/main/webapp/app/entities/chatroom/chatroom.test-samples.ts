import { IChatroom, NewChatroom } from './chatroom.model';

export const sampleWithRequiredData: IChatroom = {
  id: 45756,
  name: 'Reverse-engineered Maldives',
};

export const sampleWithPartialData: IChatroom = {
  id: 72709,
  name: 'Wooden Assurance',
};

export const sampleWithFullData: IChatroom = {
  id: 42345,
  name: 'Sports Steel quantifying',
};

export const sampleWithNewData: NewChatroom = {
  name: 'Indiana program',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
