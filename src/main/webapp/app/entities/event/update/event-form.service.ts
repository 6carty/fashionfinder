import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvent, NewEvent } from '../event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvent | NewEvent> = Omit<T, 'dateTime' | 'endTime'> & {
  dateTime?: string | null;
  endTime?: string | null;
};

type EventFormRawValue = FormValueOf<IEvent>;

type NewEventFormRawValue = FormValueOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id' | 'dateTime' | 'endTime'>;

type EventFormGroupContent = {
  id: FormControl<EventFormRawValue['id'] | NewEvent['id']>;
  title: FormControl<EventFormRawValue['title']>;
  location: FormControl<EventFormRawValue['location']>;
  dateTime: FormControl<EventFormRawValue['dateTime']>;
  endTime: FormControl<EventFormRawValue['endTime']>;
  outfit: FormControl<EventFormRawValue['outfit']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = this.convertEventToEventRawValue({
      ...this.getFormDefaults(),
      ...event,
    });
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(eventRawValue.title, {
        validators: [Validators.required],
      }),
      location: new FormControl(eventRawValue.location),
      dateTime: new FormControl(eventRawValue.dateTime, {
        validators: [Validators.required],
      }),
      endTime: new FormControl(eventRawValue.endTime),
      outfit: new FormControl(eventRawValue.outfit),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return this.convertEventRawValueToEvent(form.getRawValue() as EventFormRawValue | NewEventFormRawValue);
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = this.convertEventToEventRawValue({ ...this.getFormDefaults(), ...event });
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertEventRawValueToEvent(rawEvent: EventFormRawValue | NewEventFormRawValue): IEvent | NewEvent {
    return {
      ...rawEvent,
      dateTime: dayjs(rawEvent.dateTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawEvent.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertEventToEventRawValue(
    event: IEvent | (Partial<NewEvent> & EventFormDefaults)
  ): EventFormRawValue | PartialWithRequiredKeyOf<NewEventFormRawValue> {
    return {
      ...event,
      dateTime: event.dateTime ? event.dateTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: event.endTime ? event.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
