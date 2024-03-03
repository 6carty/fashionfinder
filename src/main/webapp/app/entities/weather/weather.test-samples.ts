import dayjs from 'dayjs/esm';

import { IWeather, NewWeather } from './weather.model';

export const sampleWithRequiredData: IWeather = {
  id: 43641,
  datetime: dayjs('2024-03-03T09:26'),
  weatherCode: 'Operations India zero',
};

export const sampleWithPartialData: IWeather = {
  id: 63964,
  datetime: dayjs('2024-03-03T00:13'),
  weatherCode: 'Officer maroon',
  minTemperature: 16404,
  precipitation: 78475,
  windSpeed: 13558,
  windDirection: 'Buckinghamshire Fresh',
};

export const sampleWithFullData: IWeather = {
  id: 98651,
  datetime: dayjs('2024-03-03T04:05'),
  weatherCode: 'Indiana Jewelery',
  maxTemperature: 58687,
  minTemperature: 60449,
  precipitation: 78786,
  windSpeed: 51007,
  windDirection: 'directional Licensed',
};

export const sampleWithNewData: NewWeather = {
  datetime: dayjs('2024-03-02T14:01'),
  weatherCode: 'Rubber',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
