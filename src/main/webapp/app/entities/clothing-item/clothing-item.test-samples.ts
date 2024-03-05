import dayjs from 'dayjs/esm';

import { ClothingType } from 'app/entities/enumerations/clothing-type.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IClothingItem, NewClothingItem } from './clothing-item.model';

export const sampleWithRequiredData: IClothingItem = {
  id: 66040,
  name: 'Liaison benchmark',
  type: ClothingType['OTHERS'],
  clothingImg: '../fake-data/blob/hipster.png',
  clothingImgContentType: 'unknown',
  status: Status['SOLD'],
};

export const sampleWithPartialData: IClothingItem = {
  id: 74226,
  name: 'Dollar Awesome 1080p',
  type: ClothingType['SHIRTS'],
  clothingImg: '../fake-data/blob/hipster.png',
  clothingImgContentType: 'unknown',
  clothingSize: 'Barthelemy deliverables Dollar',
  colour: 'productize Auto',
  status: Status['EXCHANGED'],
  lastWorn: dayjs('2024-03-03T10:33'),
};

export const sampleWithFullData: IClothingItem = {
  id: 15312,
  name: 'Gorgeous',
  type: ClothingType['DRESS'],
  clothingImg: '../fake-data/blob/hipster.png',
  clothingImgContentType: 'unknown',
  description: 'withdrawal',
  clothingSize: 'Lanka Oro Coordinator',
  colour: 'California',
  style: 'deposit Kyrgyz',
  brand: 'National',
  material: 'Maryland streamline Re-contextualized',
  status: Status['SOLD'],
  lastWorn: dayjs('2024-03-03T10:26'),
};

export const sampleWithNewData: NewClothingItem = {
  name: 'bandwidth real-time',
  type: ClothingType['TROUSERS'],
  clothingImg: '../fake-data/blob/hipster.png',
  clothingImgContentType: 'unknown',
  status: Status['EXCHANGED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
