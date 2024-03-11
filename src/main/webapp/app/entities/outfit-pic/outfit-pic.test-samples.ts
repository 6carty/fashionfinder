import { IOutfitPic, NewOutfitPic } from './outfit-pic.model';

export const sampleWithRequiredData: IOutfitPic = {
  id: 2759,
};

export const sampleWithPartialData: IOutfitPic = {
  id: 87661,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IOutfitPic = {
  id: 96544,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewOutfitPic = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
