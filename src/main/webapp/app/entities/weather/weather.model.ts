import dayjs from 'dayjs/esm';
import { ICalendar } from 'app/entities/calendar/calendar.model';

export interface IWeather {
  id: number;
  datetime?: dayjs.Dayjs | null;
  weatherCode?: string | null;
  maxTemperature?: number | null;
  minTemperature?: number | null;
  precipitation?: number | null;
  windSpeed?: number | null;
  windDirection?: string | null;
  calendar?: Pick<ICalendar, 'id'> | null;
}

export type NewWeather = Omit<IWeather, 'id'> & { id: null };
