import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICalendar, NewCalendar } from '../calendar.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICalendar for edit and NewCalendarFormGroupInput for create.
 */
type CalendarFormGroupInput = ICalendar | PartialWithRequiredKeyOf<NewCalendar>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICalendar | NewCalendar> = Omit<T, 'currentWeek' | 'calendarSync'> & {
  currentWeek?: string | null;
  calendarSync?: string | null;
};

type CalendarFormRawValue = FormValueOf<ICalendar>;

type NewCalendarFormRawValue = FormValueOf<NewCalendar>;

type CalendarFormDefaults = Pick<NewCalendar, 'id' | 'currentWeek' | 'calendarSync'>;

type CalendarFormGroupContent = {
  id: FormControl<CalendarFormRawValue['id'] | NewCalendar['id']>;
  currentWeek: FormControl<CalendarFormRawValue['currentWeek']>;
  calendarConnected: FormControl<CalendarFormRawValue['calendarConnected']>;
  calendarSync: FormControl<CalendarFormRawValue['calendarSync']>;
  userProfile: FormControl<CalendarFormRawValue['userProfile']>;
};

export type CalendarFormGroup = FormGroup<CalendarFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CalendarFormService {
  createCalendarFormGroup(calendar: CalendarFormGroupInput = { id: null }): CalendarFormGroup {
    const calendarRawValue = this.convertCalendarToCalendarRawValue({
      ...this.getFormDefaults(),
      ...calendar,
    });
    return new FormGroup<CalendarFormGroupContent>({
      id: new FormControl(
        { value: calendarRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      currentWeek: new FormControl(calendarRawValue.currentWeek, {
        validators: [Validators.required],
      }),
      calendarConnected: new FormControl(calendarRawValue.calendarConnected),
      calendarSync: new FormControl(calendarRawValue.calendarSync),
      userProfile: new FormControl(calendarRawValue.userProfile),
    });
  }

  getCalendar(form: CalendarFormGroup): ICalendar | NewCalendar {
    return this.convertCalendarRawValueToCalendar(form.getRawValue() as CalendarFormRawValue | NewCalendarFormRawValue);
  }

  resetForm(form: CalendarFormGroup, calendar: CalendarFormGroupInput): void {
    const calendarRawValue = this.convertCalendarToCalendarRawValue({ ...this.getFormDefaults(), ...calendar });
    form.reset(
      {
        ...calendarRawValue,
        id: { value: calendarRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CalendarFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      currentWeek: currentTime,
      calendarSync: currentTime,
    };
  }

  private convertCalendarRawValueToCalendar(rawCalendar: CalendarFormRawValue | NewCalendarFormRawValue): ICalendar | NewCalendar {
    return {
      ...rawCalendar,
      currentWeek: dayjs(rawCalendar.currentWeek, DATE_TIME_FORMAT),
      calendarSync: dayjs(rawCalendar.calendarSync, DATE_TIME_FORMAT),
    };
  }

  private convertCalendarToCalendarRawValue(
    calendar: ICalendar | (Partial<NewCalendar> & CalendarFormDefaults)
  ): CalendarFormRawValue | PartialWithRequiredKeyOf<NewCalendarFormRawValue> {
    return {
      ...calendar,
      currentWeek: calendar.currentWeek ? calendar.currentWeek.format(DATE_TIME_FORMAT) : undefined,
      calendarSync: calendar.calendarSync ? calendar.calendarSync.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
