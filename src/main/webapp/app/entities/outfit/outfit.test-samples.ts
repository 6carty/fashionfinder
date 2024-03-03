import dayjs from 'dayjs/esm';

import { Occasion } from 'app/entities/enumerations/occasion.model';

import { IOutfit, NewOutfit } from './outfit.model';

export const sampleWithRequiredData: IOutfit = {
  id: 6219,
  name: 'Rubber Cambridgeshire Customer-focused',
  occasion: Occasion['BUSINESS'],
};

export const sampleWithPartialData: IOutfit = {
  id: 43128,
  name: 'Shoes Baby',
  date: dayjs('2024-03-02T13:00'),
  occasion: Occasion['FORMAL'],
};

export const sampleWithFullData: IOutfit = {
  id: 22816,
  name: 'bleeding-edge',
  description: 'line Planner',
  date: dayjs('2024-03-03T09:04'),
  occasion: Occasion['CASUAL'],
};

export const sampleWithNewData: NewOutfit = {
  name: 'Ford',
  occasion: Occasion['FORMAL'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
