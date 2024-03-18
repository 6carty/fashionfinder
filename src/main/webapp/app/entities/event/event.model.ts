import dayjs from 'dayjs/esm';
import { IOutfit } from 'app/entities/outfit/outfit.model';

export interface IEvent {
  id: number;
  title?: string | null;
  location?: string | null;
  dateTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  outfit?: Pick<IOutfit, 'id' | 'name'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
