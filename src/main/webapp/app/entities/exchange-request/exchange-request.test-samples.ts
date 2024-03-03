import { IExchangeRequest, NewExchangeRequest } from './exchange-request.model';

export const sampleWithRequiredData: IExchangeRequest = {
  id: 83159,
  offeringItem: 71610,
  requestedItem: 17996,
};

export const sampleWithPartialData: IExchangeRequest = {
  id: 36390,
  offeringItem: 79628,
  requestedItem: 94847,
};

export const sampleWithFullData: IExchangeRequest = {
  id: 37944,
  offeringItem: 98048,
  requestedItem: 6279,
};

export const sampleWithNewData: NewExchangeRequest = {
  offeringItem: 79546,
  requestedItem: 83084,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
