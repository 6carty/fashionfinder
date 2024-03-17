import dayjs from 'dayjs/esm';

import { ClothingType } from 'app/entities/enumerations/clothing-type.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IClothingItem, NewClothingItem } from './clothing-item.model';

export const sampleWithRequiredData: IClothingItem = {
  id: 66040,
  name: 'Liaison benchmark',
  type: ClothingType['OTHERS'],
  status: Status['SOLD'],
};

export const sampleWithPartialData: IClothingItem = {
  id: 77597,
  name: 'Producer Federation Robust',
  type: ClothingType['HATS'],
  clothingSize: 'EXE',
  colour: 'deliverables Dollar Junction',
  status: Status['AVAILABLE'],
  lastWorn: dayjs('2024-03-02T21:32'),
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IClothingItem = {
  id: 85195,
  name: 'California',
  type: ClothingType['SHOES'],
  description: 'non-volatile',
  clothingSize: 'withdrawal',
  colour: 'Lanka Oro Coordinator',
  style: 'California',
  brand: 'deposit Kyrgyz',
  material: 'National',
  status: Status['SOLD'],
  lastWorn: dayjs('2024-03-02T22:50'),
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewClothingItem = {
  name: 'functionalities Enterprise-wide',
  type: ClothingType['DRESS'],
  status: Status['SOLD'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
