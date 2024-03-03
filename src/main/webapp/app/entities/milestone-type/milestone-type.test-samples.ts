import { IMilestoneType, NewMilestoneType } from './milestone-type.model';

export const sampleWithRequiredData: IMilestoneType = {
  id: 10595,
  name: 'Health deposit incremental',
  initialTarget: 96498,
};

export const sampleWithPartialData: IMilestoneType = {
  id: 30335,
  name: 'Flat',
  initialTarget: 6880,
};

export const sampleWithFullData: IMilestoneType = {
  id: 58132,
  name: 'Loan lavender Administrator',
  initialTarget: 70936,
  nextTarget: 90819,
};

export const sampleWithNewData: NewMilestoneType = {
  name: 'deposit',
  initialTarget: 32252,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
