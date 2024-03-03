import { ISaleListing, NewSaleListing } from './sale-listing.model';

export const sampleWithRequiredData: ISaleListing = {
  id: 13649,
  itemForSale: 56175,
  price: 90410,
};

export const sampleWithPartialData: ISaleListing = {
  id: 44775,
  itemForSale: 83306,
  price: 23457,
};

export const sampleWithFullData: ISaleListing = {
  id: 45276,
  itemForSale: 21257,
  price: 63916,
};

export const sampleWithNewData: NewSaleListing = {
  itemForSale: 7201,
  price: 53581,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
