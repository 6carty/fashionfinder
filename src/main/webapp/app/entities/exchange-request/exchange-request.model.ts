import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IExchangeRequest {
  id: number;
  offeringItem?: number | null;
  requestedItem?: number | null;
  requester?: Pick<IUserProfile, 'id'> | null;
}

export type NewExchangeRequest = Omit<IExchangeRequest, 'id'> & { id: null };
