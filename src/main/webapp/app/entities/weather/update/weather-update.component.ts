import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { WeatherFormService, WeatherFormGroup } from './weather-form.service';
import { IWeather } from '../weather.model';
import { WeatherService } from '../service/weather.service';
import { ICalendar } from 'app/entities/calendar/calendar.model';
import { CalendarService } from 'app/entities/calendar/service/calendar.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

@Component({
  selector: 'jhi-weather-update',
  templateUrl: './weather-update.component.html',
})
export class WeatherUpdateComponent implements OnInit {
  isSaving = false;
  weather: IWeather | null = null;

  calendarsSharedCollection: ICalendar[] = [];
  outfitsSharedCollection: IOutfit[] = [];

  editForm: WeatherFormGroup = this.weatherFormService.createWeatherFormGroup();

  constructor(
    protected weatherService: WeatherService,
    protected weatherFormService: WeatherFormService,
    protected calendarService: CalendarService,
    protected outfitService: OutfitService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCalendar = (o1: ICalendar | null, o2: ICalendar | null): boolean => this.calendarService.compareCalendar(o1, o2);

  compareOutfit = (o1: IOutfit | null, o2: IOutfit | null): boolean => this.outfitService.compareOutfit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ weather }) => {
      this.weather = weather;
      if (weather) {
        this.updateForm(weather);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const weather = this.weatherFormService.getWeather(this.editForm);
    if (weather.id !== null) {
      this.subscribeToSaveResponse(this.weatherService.update(weather));
    } else {
      this.subscribeToSaveResponse(this.weatherService.create(weather));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeather>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(weather: IWeather): void {
    this.weather = weather;
    this.weatherFormService.resetForm(this.editForm, weather);

    this.calendarsSharedCollection = this.calendarService.addCalendarToCollectionIfMissing<ICalendar>(
      this.calendarsSharedCollection,
      weather.calendar
    );
    this.outfitsSharedCollection = this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(
      this.outfitsSharedCollection,
      weather.weather
    );
  }

  protected loadRelationshipsOptions(): void {
    this.calendarService
      .query()
      .pipe(map((res: HttpResponse<ICalendar[]>) => res.body ?? []))
      .pipe(
        map((calendars: ICalendar[]) => this.calendarService.addCalendarToCollectionIfMissing<ICalendar>(calendars, this.weather?.calendar))
      )
      .subscribe((calendars: ICalendar[]) => (this.calendarsSharedCollection = calendars));

    this.outfitService
      .query()
      .pipe(map((res: HttpResponse<IOutfit[]>) => res.body ?? []))
      .pipe(map((outfits: IOutfit[]) => this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(outfits, this.weather?.weather)))
      .subscribe((outfits: IOutfit[]) => (this.outfitsSharedCollection = outfits));
  }
}
