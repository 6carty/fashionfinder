import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeather } from '../weather.model';

@Component({
  selector: 'jhi-weather-detail',
  templateUrl: './weather-detail.component.html',
})
export class WeatherDetailComponent implements OnInit {
  weather: IWeather | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ weather }) => {
      this.weather = weather;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
