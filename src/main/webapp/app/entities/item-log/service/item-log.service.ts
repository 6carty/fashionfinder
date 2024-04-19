import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemLog, NewItemLog } from '../item-log.model';

export type PartialUpdateItemLog = Partial<IItemLog> & Pick<IItemLog, 'id'>;

type RestOf<T extends IItemLog | NewItemLog> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestItemLog = RestOf<IItemLog>;

export type NewRestItemLog = RestOf<NewItemLog>;

export type PartialUpdateRestItemLog = RestOf<PartialUpdateItemLog>;

export type EntityResponseType = HttpResponse<IItemLog>;
export type EntityArrayResponseType = HttpResponse<IItemLog[]>;

@Injectable({ providedIn: 'root' })
export class ItemLogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-logs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemLog: NewItemLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itemLog);
    return this.http
      .post<RestItemLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(itemLog: IItemLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itemLog);
    return this.http
      .put<RestItemLog>(`${this.resourceUrl}/${this.getItemLogIdentifier(itemLog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(itemLog: PartialUpdateItemLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(itemLog);
    return this.http
      .patch<RestItemLog>(`${this.resourceUrl}/${this.getItemLogIdentifier(itemLog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestItemLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestItemLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemLogIdentifier(itemLog: Pick<IItemLog, 'id'>): number {
    return itemLog.id;
  }

  compareItemLog(o1: Pick<IItemLog, 'id'> | null, o2: Pick<IItemLog, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemLogIdentifier(o1) === this.getItemLogIdentifier(o2) : o1 === o2;
  }

  addItemLogToCollectionIfMissing<Type extends Pick<IItemLog, 'id'>>(
    itemLogCollection: Type[],
    ...itemLogsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemLogs: Type[] = itemLogsToCheck.filter(isPresent);
    if (itemLogs.length > 0) {
      const itemLogCollectionIdentifiers = itemLogCollection.map(itemLogItem => this.getItemLogIdentifier(itemLogItem)!);
      const itemLogsToAdd = itemLogs.filter(itemLogItem => {
        const itemLogIdentifier = this.getItemLogIdentifier(itemLogItem);
        if (itemLogCollectionIdentifiers.includes(itemLogIdentifier)) {
          return false;
        }
        itemLogCollectionIdentifiers.push(itemLogIdentifier);
        return true;
      });
      return [...itemLogsToAdd, ...itemLogCollection];
    }
    return itemLogCollection;
  }

  protected convertDateFromClient<T extends IItemLog | NewItemLog | PartialUpdateItemLog>(itemLog: T): RestOf<T> {
    return {
      ...itemLog,
      date: itemLog.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restItemLog: RestItemLog): IItemLog {
    return {
      ...restItemLog,
      date: restItemLog.date ? dayjs(restItemLog.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestItemLog>): HttpResponse<IItemLog> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestItemLog[]>): HttpResponse<IItemLog[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
