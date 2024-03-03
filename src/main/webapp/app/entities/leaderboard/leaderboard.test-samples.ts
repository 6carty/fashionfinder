import { ILeaderboard, NewLeaderboard } from './leaderboard.model';

export const sampleWithRequiredData: ILeaderboard = {
  id: 26767,
};

export const sampleWithPartialData: ILeaderboard = {
  id: 71148,
  likeCount: 7900,
  position: 66746,
};

export const sampleWithFullData: ILeaderboard = {
  id: 68778,
  profilePic: '../fake-data/blob/hipster.png',
  profilePicContentType: 'unknown',
  usersName: 'Ball extensible',
  likeCount: 63532,
  position: 40644,
};

export const sampleWithNewData: NewLeaderboard = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
