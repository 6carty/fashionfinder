import dayjs from 'dayjs/esm';
import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { IOutfit } from 'app/entities/outfit/outfit.model';

export interface IEvent {
  id: number;
  title?: string | null;
  location?: string | null;
  dateTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  clothingItem?: Pick<IClothingItem, 'id'> | null;
  outfit?: Pick<IOutfit, 'id'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
