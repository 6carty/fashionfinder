import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IWeather, NewWeather } from '../weather.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWeather for edit and NewWeatherFormGroupInput for create.
 */
type WeatherFormGroupInput = IWeather | PartialWithRequiredKeyOf<NewWeather>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IWeather | NewWeather> = Omit<T, 'datetime'> & {
  datetime?: string | null;
};

type WeatherFormRawValue = FormValueOf<IWeather>;

type NewWeatherFormRawValue = FormValueOf<NewWeather>;

type WeatherFormDefaults = Pick<NewWeather, 'id' | 'datetime'>;

type WeatherFormGroupContent = {
  id: FormControl<WeatherFormRawValue['id'] | NewWeather['id']>;
  datetime: FormControl<WeatherFormRawValue['datetime']>;
  weatherCode: FormControl<WeatherFormRawValue['weatherCode']>;
  maxTemperature: FormControl<WeatherFormRawValue['maxTemperature']>;
  minTemperature: FormControl<WeatherFormRawValue['minTemperature']>;
  precipitation: FormControl<WeatherFormRawValue['precipitation']>;
  windSpeed: FormControl<WeatherFormRawValue['windSpeed']>;
  windDirection: FormControl<WeatherFormRawValue['windDirection']>;
  calendar: FormControl<WeatherFormRawValue['calendar']>;
  weather: FormControl<WeatherFormRawValue['weather']>;
};

export type WeatherFormGroup = FormGroup<WeatherFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WeatherFormService {
  createWeatherFormGroup(weather: WeatherFormGroupInput = { id: null }): WeatherFormGroup {
    const weatherRawValue = this.convertWeatherToWeatherRawValue({
      ...this.getFormDefaults(),
      ...weather,
    });
    return new FormGroup<WeatherFormGroupContent>({
      id: new FormControl(
        { value: weatherRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      datetime: new FormControl(weatherRawValue.datetime, {
        validators: [Validators.required],
      }),
      weatherCode: new FormControl(weatherRawValue.weatherCode, {
        validators: [Validators.required],
      }),
      maxTemperature: new FormControl(weatherRawValue.maxTemperature),
      minTemperature: new FormControl(weatherRawValue.minTemperature),
      precipitation: new FormControl(weatherRawValue.precipitation),
      windSpeed: new FormControl(weatherRawValue.windSpeed),
      windDirection: new FormControl(weatherRawValue.windDirection),
      calendar: new FormControl(weatherRawValue.calendar),
      weather: new FormControl(weatherRawValue.weather),
    });
  }

  getWeather(form: WeatherFormGroup): IWeather | NewWeather {
    return this.convertWeatherRawValueToWeather(form.getRawValue() as WeatherFormRawValue | NewWeatherFormRawValue);
  }

  resetForm(form: WeatherFormGroup, weather: WeatherFormGroupInput): void {
    const weatherRawValue = this.convertWeatherToWeatherRawValue({ ...this.getFormDefaults(), ...weather });
    form.reset(
      {
        ...weatherRawValue,
        id: { value: weatherRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WeatherFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datetime: currentTime,
    };
  }

  private convertWeatherRawValueToWeather(rawWeather: WeatherFormRawValue | NewWeatherFormRawValue): IWeather | NewWeather {
    return {
      ...rawWeather,
      datetime: dayjs(rawWeather.datetime, DATE_TIME_FORMAT),
    };
  }

  private convertWeatherToWeatherRawValue(
    weather: IWeather | (Partial<NewWeather> & WeatherFormDefaults)
  ): WeatherFormRawValue | PartialWithRequiredKeyOf<NewWeatherFormRawValue> {
    return {
      ...weather,
      datetime: weather.datetime ? weather.datetime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
