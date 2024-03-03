import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICalendar, NewCalendar } from '../calendar.model';

export type PartialUpdateCalendar = Partial<ICalendar> & Pick<ICalendar, 'id'>;

type RestOf<T extends ICalendar | NewCalendar> = Omit<T, 'currentWeek' | 'calendarSync'> & {
  currentWeek?: string | null;
  calendarSync?: string | null;
};

export type RestCalendar = RestOf<ICalendar>;

export type NewRestCalendar = RestOf<NewCalendar>;

export type PartialUpdateRestCalendar = RestOf<PartialUpdateCalendar>;

export type EntityResponseType = HttpResponse<ICalendar>;
export type EntityArrayResponseType = HttpResponse<ICalendar[]>;

@Injectable({ providedIn: 'root' })
export class CalendarService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/calendars');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(calendar: NewCalendar): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calendar);
    return this.http
      .post<RestCalendar>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(calendar: ICalendar): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calendar);
    return this.http
      .put<RestCalendar>(`${this.resourceUrl}/${this.getCalendarIdentifier(calendar)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(calendar: PartialUpdateCalendar): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calendar);
    return this.http
      .patch<RestCalendar>(`${this.resourceUrl}/${this.getCalendarIdentifier(calendar)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCalendar>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCalendar[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCalendarIdentifier(calendar: Pick<ICalendar, 'id'>): number {
    return calendar.id;
  }

  compareCalendar(o1: Pick<ICalendar, 'id'> | null, o2: Pick<ICalendar, 'id'> | null): boolean {
    return o1 && o2 ? this.getCalendarIdentifier(o1) === this.getCalendarIdentifier(o2) : o1 === o2;
  }

  addCalendarToCollectionIfMissing<Type extends Pick<ICalendar, 'id'>>(
    calendarCollection: Type[],
    ...calendarsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const calendars: Type[] = calendarsToCheck.filter(isPresent);
    if (calendars.length > 0) {
      const calendarCollectionIdentifiers = calendarCollection.map(calendarItem => this.getCalendarIdentifier(calendarItem)!);
      const calendarsToAdd = calendars.filter(calendarItem => {
        const calendarIdentifier = this.getCalendarIdentifier(calendarItem);
        if (calendarCollectionIdentifiers.includes(calendarIdentifier)) {
          return false;
        }
        calendarCollectionIdentifiers.push(calendarIdentifier);
        return true;
      });
      return [...calendarsToAdd, ...calendarCollection];
    }
    return calendarCollection;
  }

  protected convertDateFromClient<T extends ICalendar | NewCalendar | PartialUpdateCalendar>(calendar: T): RestOf<T> {
    return {
      ...calendar,
      currentWeek: calendar.currentWeek?.toJSON() ?? null,
      calendarSync: calendar.calendarSync?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCalendar: RestCalendar): ICalendar {
    return {
      ...restCalendar,
      currentWeek: restCalendar.currentWeek ? dayjs(restCalendar.currentWeek) : undefined,
      calendarSync: restCalendar.calendarSync ? dayjs(restCalendar.calendarSync) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCalendar>): HttpResponse<ICalendar> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCalendar[]>): HttpResponse<ICalendar[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
