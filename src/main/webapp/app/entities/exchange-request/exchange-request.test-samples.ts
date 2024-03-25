import { IExchangeRequest, NewExchangeRequest } from './exchange-request.model';

export const sampleWithRequiredData: IExchangeRequest = {
  id: 83159,
  description: 'Pants Markets Fresh',
};

export const sampleWithPartialData: IExchangeRequest = {
  id: 24086,
  description: 'Directives Mill generation',
};

export const sampleWithFullData: IExchangeRequest = {
  id: 25824,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  description: 'Vermont',
};

export const sampleWithNewData: NewExchangeRequest = {
  description: 'benchmark Ethiopia Solutions',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
