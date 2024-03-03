import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../weather.test-samples';

import { WeatherFormService } from './weather-form.service';

describe('Weather Form Service', () => {
  let service: WeatherFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherFormService);
  });

  describe('Service methods', () => {
    describe('createWeatherFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWeatherFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            datetime: expect.any(Object),
            weatherCode: expect.any(Object),
            maxTemperature: expect.any(Object),
            minTemperature: expect.any(Object),
            precipitation: expect.any(Object),
            windSpeed: expect.any(Object),
            windDirection: expect.any(Object),
            calendar: expect.any(Object),
          })
        );
      });

      it('passing IWeather should create a new form with FormGroup', () => {
        const formGroup = service.createWeatherFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            datetime: expect.any(Object),
            weatherCode: expect.any(Object),
            maxTemperature: expect.any(Object),
            minTemperature: expect.any(Object),
            precipitation: expect.any(Object),
            windSpeed: expect.any(Object),
            windDirection: expect.any(Object),
            calendar: expect.any(Object),
          })
        );
      });
    });

    describe('getWeather', () => {
      it('should return NewWeather for default Weather initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWeatherFormGroup(sampleWithNewData);

        const weather = service.getWeather(formGroup) as any;

        expect(weather).toMatchObject(sampleWithNewData);
      });

      it('should return NewWeather for empty Weather initial value', () => {
        const formGroup = service.createWeatherFormGroup();

        const weather = service.getWeather(formGroup) as any;

        expect(weather).toMatchObject({});
      });

      it('should return IWeather', () => {
        const formGroup = service.createWeatherFormGroup(sampleWithRequiredData);

        const weather = service.getWeather(formGroup) as any;

        expect(weather).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWeather should not enable id FormControl', () => {
        const formGroup = service.createWeatherFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWeather should disable id FormControl', () => {
        const formGroup = service.createWeatherFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
