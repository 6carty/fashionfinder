import { ITrendingOutfit, NewTrendingOutfit } from './trending-outfit.model';

export const sampleWithRequiredData: ITrendingOutfit = {
  id: 58173,
  name: 'lavender',
};

export const sampleWithPartialData: ITrendingOutfit = {
  id: 77314,
  name: 'program Industrial',
};

export const sampleWithFullData: ITrendingOutfit = {
  id: 63198,
  name: 'Beauty Guyana',
  description: 'circuit Island',
};

export const sampleWithNewData: NewTrendingOutfit = {
  name: 'program convergence red',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
