import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface WeatherData {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {
  private api =
    'https://api.open-meteo.com/v1/forecast?latitude=52.4814&longitude=-1.8998&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=GMT';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<WeatherData>(this.api).pipe(
      map(response => this.parseData(response)),
      catchError(error => {
        // Handle errors here
        return throwError('Unable to obtain weather data');
      })
    );
  }

  private parseData(data: WeatherData) {
    const weatherData: {
      date: string;
      weatherCode: number | string;
      minTemp: number;
      maxTemp: number;
      precipitation: number;
      windSpeed: number | string;
    }[] = [];
    for (let i = 0; i < data.daily.time.length; i++) {
      weatherData.push({
        date: this.parseDate(data.daily.time[i]),
        weatherCode: this.parseWeatherCode(data.daily.weather_code[i]),
        minTemp: this.roundToNearestInt(data.daily.temperature_2m_min[i]),
        maxTemp: this.roundToNearestInt(data.daily.temperature_2m_max[i]),
        precipitation: data.daily.precipitation_probability_max[i],
        windSpeed: data.daily.wind_speed_10m_max[i],
      });
    }
    return weatherData;
  }

  private parseWeatherCode(data: number): string {
    switch (data) {
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
        return 'Unknown weather code: ' + data; // Handle unknown codes
    }
  }

  private roundToNearestInt(num: number): number {
    return Math.round(num); // Round to nearest integer
  }

  private parseDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  }
}
