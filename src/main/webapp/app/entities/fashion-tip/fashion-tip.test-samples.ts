import { IFashionTip, NewFashionTip } from './fashion-tip.model';

export const sampleWithRequiredData: IFashionTip = {
  id: 52795,
  title1: 'Shoes Ford',
};

export const sampleWithPartialData: IFashionTip = {
  id: 95163,
  title1: 'Devolved',
  description1: 'Cheese',
  title2: 'array',
  description2: 'red Fresh implement',
};

export const sampleWithFullData: IFashionTip = {
  id: 1403,
  title1: 'Ports Officer',
  description1: 'overriding',
  title2: 'Brand Dale',
  description2: 'one-to-one Concrete experiences',
};

export const sampleWithNewData: NewFashionTip = {
  title1: 'infrastructures',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
