import { IClothingPic, NewClothingPic } from './clothing-pic.model';

export const sampleWithRequiredData: IClothingPic = {
  id: 52681,
};

export const sampleWithPartialData: IClothingPic = {
  id: 61200,
};

export const sampleWithFullData: IClothingPic = {
  id: 72178,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewClothingPic = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
