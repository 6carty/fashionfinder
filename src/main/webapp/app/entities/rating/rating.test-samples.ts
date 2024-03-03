import { IRating, NewRating } from './rating.model';

export const sampleWithRequiredData: IRating = {
  id: 92458,
  rating: 88012,
};

export const sampleWithPartialData: IRating = {
  id: 38329,
  rating: 62920,
};

export const sampleWithFullData: IRating = {
  id: 48944,
  rating: 33071,
};

export const sampleWithNewData: NewRating = {
  rating: 32763,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
