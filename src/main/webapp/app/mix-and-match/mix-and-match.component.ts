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
  currentHourWeatherCode: number | undefined;
  currentWeatherDescription: string = '';
  currentHourHumidity: number | undefined;
  currentHourPrecipitation: number | undefined;
  weatherData: any;
  constructor() {}

  ngOnInit(): void {
    this.getCurrentDateTime(); // Call the method initially
    setInterval(() => {
      this.getCurrentDateTime(); // Call the method every second
    }, 1000);
    this.fetchWeatherData();
    setInterval(() => {
      this.getCurrentHourData();
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
      latitude: 52.4862,
      longitude: -1.8904,
      hourly: ['temperature_2m', 'relative_humidity_2m', 'precipitation', 'weather_code', 'wind_speed_10m'],
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
        relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
        precipitation: hourly.variables(2)!.valuesArray()!,
        weatherCode: hourly.variables(3)!.valuesArray()!,
        windSpeed10m: hourly.variables(4)!.valuesArray()!,
      },
    };
    console.log(this.weatherData);
    this.getCurrentHourData();
  }
  getCurrentHourData(): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Find the index of the current hour in the weatherData.hourly.time array
    const currentIndex = this.weatherData.hourly.time.findIndex((time: Date) => time.getHours() === currentHour);

    // If the current hour is found in the array
    if (currentIndex !== -1) {
      const temperature = this.weatherData.hourly.temperature2m[currentIndex];
      this.currentHourTemperature = Number(temperature.toFixed(1));
      this.currentHourHumidity = this.weatherData.hourly.relativeHumidity2m[currentIndex];
      this.currentHourPrecipitation = this.weatherData.hourly.precipitation[currentIndex];
      this.currentWeatherDescription = this.getWeatherDescription(this.weatherData.hourly.weatherCode[currentIndex]);
    } else {
      console.error('Weather data not available for the current hour.');
    }
  }
  getWeatherDescription(weatherCode: number): string {
    switch (weatherCode) {
      case 0:
        return 'Clear Sky';
      case 1:
        return 'Mainly clear';
      case 2:
        return 'Partly Cloudy';
      case 3:
        return 'Overcast';
      case 45:
        return 'Fog';
      case 48:
        return 'Depositing rime fog';
      case 51:
        return 'Light drizzle';
      case 53:
        return 'Moderate drizzle';
      case 55:
        return 'Dense drizzle';
      case 56:
        return 'Light freezing drizzle';
      case 57:
        return 'Dense freezing drizzle';
      case 61:
        return 'Slight rain';
      case 63:
        return 'Moderate rain';
      case 65:
        return 'Heavy rain';
      case 66:
        return 'Light freezing rain';
      case 67:
        return 'Heavy freezing rain';
      case 71:
        return 'Slight snow fall';
      case 73:
        return 'Moderate snow fall';
      case 75:
        return 'Heavy snow fall';
      case 77:
        return 'Snow grains';
      case 80:
        return 'Slight rain showers';
      case 81:
        return 'Moderate rain showers';
      case 82:
        return 'Violent rain showers';
      case 85:
        return 'Slight snow showers';
      case 86:
        return 'Heavy snow showers';
      case 95:
        return 'Thunderstorm: Slight or moderate';
      case 96:
        return 'Thunderstorm with slight hail';
      case 99:
        return 'Thunderstorm with heavy hail';
      default:
        return 'Unknown weather code: ' + weatherCode; // Handle unknown codes
    }
  }
}
