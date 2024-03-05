import { Component, OnInit } from '@angular/core';
import { fetchWeatherApi } from "openmeteo";

@Component({
  selector: 'jhi-mix-and-match',
  templateUrl: './mix-and-match.component.html',
  styleUrls: ['./mix-and-match.component.scss'],
})
export class MixAndMatchComponent implements OnInit {
  currentDateStr: string = '';
  currentTimeStr: string = '';
  currentHourTemperature: number | undefined;
  weatherData: any;
  constructor() {}

  ngOnInit(): void {
    this.getCurrentDateTime(); // Call the method initially
    setInterval(() => {
      this.getCurrentDateTime(); // Call the method every second
    }, 1000);
    this.fetchWeatherData();
    setInterval(() => {
      this.getCurrentHourTemperature();
    }, 3600000);
  }
  getCurrentDateTime(): void {
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    this.currentDateStr = `${dayOfWeek} ${dayOfMonth}, ${month}`;
    // this.currentDateStr = currentDate.toDateString();
    this.currentTimeStr = currentDate.toLocaleTimeString();
  }
  async fetchWeatherData(): Promise<void> {
    const params = {
      latitude: 52.52,
      longitude: 13.41,
      hourly: 'temperature_2m',
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    this.weatherData = {
      hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(t => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
      },
    };
    console.log(this.weatherData);
    this.getCurrentHourTemperature();
  }
  getCurrentHourTemperature(): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Find the index of the current hour in the weatherData.hourly.time array
    const currentIndex = this.weatherData.hourly.time.findIndex((time: Date) => time.getHours() === currentHour);

    // If the current hour is found in the array
    if (currentIndex !== -1) {
      // Retrieve the temperature for the current hour
      const temperature = this.weatherData.hourly.temperature2m[currentIndex];
      this.currentHourTemperature = Number(temperature.toFixed(1));
      // this.currentHourTemperature = this.weatherData.hourly.temperature2m[currentIndex];
    } else {
      // Handle the case where the current hour is not found
      console.error('Temperature data not available for the current hour.');
    }
  }
}
