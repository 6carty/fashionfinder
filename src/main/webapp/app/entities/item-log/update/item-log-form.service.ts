import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IItemLog, NewItemLog } from '../item-log.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemLog for edit and NewItemLogFormGroupInput for create.
 */
type ItemLogFormGroupInput = IItemLog | PartialWithRequiredKeyOf<NewItemLog>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IItemLog | NewItemLog> = Omit<T, 'date'> & {
  date?: string | null;
};

type ItemLogFormRawValue = FormValueOf<IItemLog>;

type NewItemLogFormRawValue = FormValueOf<NewItemLog>;

type ItemLogFormDefaults = Pick<NewItemLog, 'id' | 'date'>;

type ItemLogFormGroupContent = {
  id: FormControl<ItemLogFormRawValue['id'] | NewItemLog['id']>;
  date: FormControl<ItemLogFormRawValue['date']>;
  owner: FormControl<ItemLogFormRawValue['owner']>;
  outfit: FormControl<ItemLogFormRawValue['outfit']>;
};

export type ItemLogFormGroup = FormGroup<ItemLogFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemLogFormService {
  createItemLogFormGroup(itemLog: ItemLogFormGroupInput = { id: null }): ItemLogFormGroup {
    const itemLogRawValue = this.convertItemLogToItemLogRawValue({
      ...this.getFormDefaults(),
      ...itemLog,
    });
    return new FormGroup<ItemLogFormGroupContent>({
      id: new FormControl(
        { value: itemLogRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(itemLogRawValue.date, {
        validators: [Validators.required],
      }),
      owner: new FormControl(itemLogRawValue.owner),
      outfit: new FormControl(itemLogRawValue.outfit),
    });
  }

  getItemLog(form: ItemLogFormGroup): IItemLog | NewItemLog {
    return this.convertItemLogRawValueToItemLog(form.getRawValue() as ItemLogFormRawValue | NewItemLogFormRawValue);
  }

  resetForm(form: ItemLogFormGroup, itemLog: ItemLogFormGroupInput): void {
    const itemLogRawValue = this.convertItemLogToItemLogRawValue({ ...this.getFormDefaults(), ...itemLog });
    form.reset(
      {
        ...itemLogRawValue,
        id: { value: itemLogRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemLogFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertItemLogRawValueToItemLog(rawItemLog: ItemLogFormRawValue | NewItemLogFormRawValue): IItemLog | NewItemLog {
    return {
      ...rawItemLog,
      date: dayjs(rawItemLog.date, DATE_TIME_FORMAT),
    };
  }

  private convertItemLogToItemLogRawValue(
    itemLog: IItemLog | (Partial<NewItemLog> & ItemLogFormDefaults)
  ): ItemLogFormRawValue | PartialWithRequiredKeyOf<NewItemLogFormRawValue> {
    return {
      ...itemLog,
      date: itemLog.date ? itemLog.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
