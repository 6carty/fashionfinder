import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClothingItem, NewClothingItem } from '../clothing-item.model';

export type PartialUpdateClothingItem = Partial<IClothingItem> & Pick<IClothingItem, 'id'>;

type RestOf<T extends IClothingItem | NewClothingItem> = Omit<T, 'lastWorn'> & {
  lastWorn?: string | null;
};

export type RestClothingItem = RestOf<IClothingItem>;

export type NewRestClothingItem = RestOf<NewClothingItem>;

export type PartialUpdateRestClothingItem = RestOf<PartialUpdateClothingItem>;

export type EntityResponseType = HttpResponse<IClothingItem>;
export type EntityArrayResponseType = HttpResponse<IClothingItem[]>;

@Injectable({ providedIn: 'root' })
export class ClothingItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clothing-items');
  private clothingData = new BehaviorSubject<number | null>(null);
  clothingData$ = this.clothingData.asObservable();

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(clothingItem: NewClothingItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clothingItem);
    return this.http
      .post<RestClothingItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(clothingItem: IClothingItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clothingItem);
    return this.http
      .put<RestClothingItem>(`${this.resourceUrl}/${this.getClothingItemIdentifier(clothingItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(clothingItem: PartialUpdateClothingItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clothingItem);
    return this.http
      .patch<RestClothingItem>(`${this.resourceUrl}/${this.getClothingItemIdentifier(clothingItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestClothingItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestClothingItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClothingItemIdentifier(clothingItem: Pick<IClothingItem, 'id'>): number {
    return clothingItem.id;
  }

  compareClothingItem(o1: Pick<IClothingItem, 'id'> | null, o2: Pick<IClothingItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getClothingItemIdentifier(o1) === this.getClothingItemIdentifier(o2) : o1 === o2;
  }

  addClothingItemToCollectionIfMissing<Type extends Pick<IClothingItem, 'id'>>(
    clothingItemCollection: Type[],
    ...clothingItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clothingItems: Type[] = clothingItemsToCheck.filter(isPresent);
    if (clothingItems.length > 0) {
      const clothingItemCollectionIdentifiers = clothingItemCollection.map(
        clothingItemItem => this.getClothingItemIdentifier(clothingItemItem)!
      );
      const clothingItemsToAdd = clothingItems.filter(clothingItemItem => {
        const clothingItemIdentifier = this.getClothingItemIdentifier(clothingItemItem);
        if (clothingItemCollectionIdentifiers.includes(clothingItemIdentifier)) {
          return false;
        }
        clothingItemCollectionIdentifiers.push(clothingItemIdentifier);
        return true;
      });
      return [...clothingItemsToAdd, ...clothingItemCollection];
    }
    return clothingItemCollection;
  }

  protected convertDateFromClient<T extends IClothingItem | NewClothingItem | PartialUpdateClothingItem>(clothingItem: T): RestOf<T> {
    return {
      ...clothingItem,
      lastWorn: clothingItem.lastWorn?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restClothingItem: RestClothingItem): IClothingItem {
    return {
      ...restClothingItem,
      lastWorn: restClothingItem.lastWorn ? dayjs(restClothingItem.lastWorn) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestClothingItem>): HttpResponse<IClothingItem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestClothingItem[]>): HttpResponse<IClothingItem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
