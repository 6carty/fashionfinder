import dayjs from 'dayjs/esm';

export interface IEvent {
  id: number;
  title?: string | null;
  location?: string | null;
  dateTime?: dayjs.Dayjs | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
