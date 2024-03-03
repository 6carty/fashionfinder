import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWeather, NewWeather } from '../weather.model';

export type PartialUpdateWeather = Partial<IWeather> & Pick<IWeather, 'id'>;

type RestOf<T extends IWeather | NewWeather> = Omit<T, 'datetime'> & {
  datetime?: string | null;
};

export type RestWeather = RestOf<IWeather>;

export type NewRestWeather = RestOf<NewWeather>;

export type PartialUpdateRestWeather = RestOf<PartialUpdateWeather>;

export type EntityResponseType = HttpResponse<IWeather>;
export type EntityArrayResponseType = HttpResponse<IWeather[]>;

@Injectable({ providedIn: 'root' })
export class WeatherService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/weathers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(weather: NewWeather): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weather);
    return this.http
      .post<RestWeather>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(weather: IWeather): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weather);
    return this.http
      .put<RestWeather>(`${this.resourceUrl}/${this.getWeatherIdentifier(weather)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(weather: PartialUpdateWeather): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weather);
    return this.http
      .patch<RestWeather>(`${this.resourceUrl}/${this.getWeatherIdentifier(weather)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestWeather>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestWeather[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWeatherIdentifier(weather: Pick<IWeather, 'id'>): number {
    return weather.id;
  }

  compareWeather(o1: Pick<IWeather, 'id'> | null, o2: Pick<IWeather, 'id'> | null): boolean {
    return o1 && o2 ? this.getWeatherIdentifier(o1) === this.getWeatherIdentifier(o2) : o1 === o2;
  }

  addWeatherToCollectionIfMissing<Type extends Pick<IWeather, 'id'>>(
    weatherCollection: Type[],
    ...weathersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const weathers: Type[] = weathersToCheck.filter(isPresent);
    if (weathers.length > 0) {
      const weatherCollectionIdentifiers = weatherCollection.map(weatherItem => this.getWeatherIdentifier(weatherItem)!);
      const weathersToAdd = weathers.filter(weatherItem => {
        const weatherIdentifier = this.getWeatherIdentifier(weatherItem);
        if (weatherCollectionIdentifiers.includes(weatherIdentifier)) {
          return false;
        }
        weatherCollectionIdentifiers.push(weatherIdentifier);
        return true;
      });
      return [...weathersToAdd, ...weatherCollection];
    }
    return weatherCollection;
  }

  protected convertDateFromClient<T extends IWeather | NewWeather | PartialUpdateWeather>(weather: T): RestOf<T> {
    return {
      ...weather,
      datetime: weather.datetime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restWeather: RestWeather): IWeather {
    return {
      ...restWeather,
      datetime: restWeather.datetime ? dayjs(restWeather.datetime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestWeather>): HttpResponse<IWeather> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestWeather[]>): HttpResponse<IWeather[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
