import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOutfit, NewOutfit } from '../outfit.model';

export type PartialUpdateOutfit = Partial<IOutfit> & Pick<IOutfit, 'id'>;

type RestOf<T extends IOutfit | NewOutfit> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestOutfit = RestOf<IOutfit>;

export type NewRestOutfit = RestOf<NewOutfit>;

export type PartialUpdateRestOutfit = RestOf<PartialUpdateOutfit>;

export type EntityResponseType = HttpResponse<IOutfit>;
export type EntityArrayResponseType = HttpResponse<IOutfit[]>;

@Injectable({ providedIn: 'root' })
export class OutfitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/outfits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(outfit: NewOutfit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(outfit);
    return this.http
      .post<RestOutfit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(outfit: IOutfit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(outfit);
    return this.http
      .put<RestOutfit>(`${this.resourceUrl}/${this.getOutfitIdentifier(outfit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(outfit: PartialUpdateOutfit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(outfit);
    return this.http
      .patch<RestOutfit>(`${this.resourceUrl}/${this.getOutfitIdentifier(outfit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOutfit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOutfit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOutfitIdentifier(outfit: Pick<IOutfit, 'id'>): number {
    return outfit.id;
  }

  compareOutfit(o1: Pick<IOutfit, 'id'> | null, o2: Pick<IOutfit, 'id'> | null): boolean {
    return o1 && o2 ? this.getOutfitIdentifier(o1) === this.getOutfitIdentifier(o2) : o1 === o2;
  }

  addOutfitToCollectionIfMissing<Type extends Pick<IOutfit, 'id'>>(
    outfitCollection: Type[],
    ...outfitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const outfits: Type[] = outfitsToCheck.filter(isPresent);
    if (outfits.length > 0) {
      const outfitCollectionIdentifiers = outfitCollection.map(outfitItem => this.getOutfitIdentifier(outfitItem)!);
      const outfitsToAdd = outfits.filter(outfitItem => {
        const outfitIdentifier = this.getOutfitIdentifier(outfitItem);
        if (outfitCollectionIdentifiers.includes(outfitIdentifier)) {
          return false;
        }
        outfitCollectionIdentifiers.push(outfitIdentifier);
        return true;
      });
      return [...outfitsToAdd, ...outfitCollection];
    }
    return outfitCollection;
  }

  protected convertDateFromClient<T extends IOutfit | NewOutfit | PartialUpdateOutfit>(outfit: T): RestOf<T> {
    return {
      ...outfit,
      date: outfit.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOutfit: RestOutfit): IOutfit {
    return {
      ...restOutfit,
      date: restOutfit.date ? dayjs(restOutfit.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOutfit>): HttpResponse<IOutfit> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOutfit[]>): HttpResponse<IOutfit[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
