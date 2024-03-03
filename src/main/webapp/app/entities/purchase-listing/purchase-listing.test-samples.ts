import { IPurchaseListing, NewPurchaseListing } from './purchase-listing.model';

export const sampleWithRequiredData: IPurchaseListing = {
  id: 71434,
  itemForSale: 61325,
  price: 95940,
};

export const sampleWithPartialData: IPurchaseListing = {
  id: 10423,
  itemForSale: 52213,
  price: 89335,
};

export const sampleWithFullData: IPurchaseListing = {
  id: 45404,
  itemForSale: 85848,
  price: 42961,
};

export const sampleWithNewData: NewPurchaseListing = {
  itemForSale: 14014,
  price: 51574,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
