import dayjs from 'dayjs/esm';

import { Occasion } from 'app/entities/enumerations/occasion.model';

import { IOutfit, NewOutfit } from './outfit.model';

export const sampleWithRequiredData: IOutfit = {
  id: 6219,
  name: 'Rubber Cambridgeshire Customer-focused',
  occasion: Occasion['BUSINESS'],
};

export const sampleWithPartialData: IOutfit = {
  id: 47386,
  name: 'IB',
  date: dayjs('2024-03-02T18:51'),
  occasion: Occasion['FORMAL'],
};

export const sampleWithFullData: IOutfit = {
  id: 65315,
  name: 'Officer Future-proofed Mills',
  description: 'Kwacha Delaware heuristic',
  date: dayjs('2024-03-02T13:26'),
  occasion: Occasion['FORMAL'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewOutfit = {
  name: 'Refined Principal Representative',
  occasion: Occasion['CASUAL'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
