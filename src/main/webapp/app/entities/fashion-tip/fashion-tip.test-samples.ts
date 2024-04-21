import { IFashionTip, NewFashionTip } from './fashion-tip.model';

export const sampleWithRequiredData: IFashionTip = {
  id: 52795,
  title1: 'Shoes Ford',
};

export const sampleWithPartialData: IFashionTip = {
  id: 55750,
  title1: 'Directives Cheese Cheese',
  description1: 'array',
};

export const sampleWithFullData: IFashionTip = {
  id: 95619,
  title1: 'Health',
  description1: 'AGP',
};

export const sampleWithNewData: NewFashionTip = {
  title1: 'Kids withdrawal',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
