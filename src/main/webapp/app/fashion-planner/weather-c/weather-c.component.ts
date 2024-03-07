import { Component, OnInit } from '@angular/core';
import { WeatherDataService } from './weather-data.service';

@Component({
  selector: 'jhi-weather-c',
  templateUrl: './weather-c.component.html',
  styleUrls: ['./weather-c.component.scss'],
})
export class WeatherCComponent implements OnInit {
  data: any;
  constructor(private weatherService: WeatherDataService) {}

  ngOnInit(): void {
    this.weatherService.getData().subscribe(data => {
      this.data = data;
      console.log(data);
    });
  }
}
