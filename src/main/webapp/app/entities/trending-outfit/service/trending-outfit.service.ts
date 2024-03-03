import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrendingOutfit, NewTrendingOutfit } from '../trending-outfit.model';

export type PartialUpdateTrendingOutfit = Partial<ITrendingOutfit> & Pick<ITrendingOutfit, 'id'>;

export type EntityResponseType = HttpResponse<ITrendingOutfit>;
export type EntityArrayResponseType = HttpResponse<ITrendingOutfit[]>;

@Injectable({ providedIn: 'root' })
export class TrendingOutfitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trending-outfits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(trendingOutfit: NewTrendingOutfit): Observable<EntityResponseType> {
    return this.http.post<ITrendingOutfit>(this.resourceUrl, trendingOutfit, { observe: 'response' });
  }

  update(trendingOutfit: ITrendingOutfit): Observable<EntityResponseType> {
    return this.http.put<ITrendingOutfit>(`${this.resourceUrl}/${this.getTrendingOutfitIdentifier(trendingOutfit)}`, trendingOutfit, {
      observe: 'response',
    });
  }

  partialUpdate(trendingOutfit: PartialUpdateTrendingOutfit): Observable<EntityResponseType> {
    return this.http.patch<ITrendingOutfit>(`${this.resourceUrl}/${this.getTrendingOutfitIdentifier(trendingOutfit)}`, trendingOutfit, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITrendingOutfit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrendingOutfit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTrendingOutfitIdentifier(trendingOutfit: Pick<ITrendingOutfit, 'id'>): number {
    return trendingOutfit.id;
  }

  compareTrendingOutfit(o1: Pick<ITrendingOutfit, 'id'> | null, o2: Pick<ITrendingOutfit, 'id'> | null): boolean {
    return o1 && o2 ? this.getTrendingOutfitIdentifier(o1) === this.getTrendingOutfitIdentifier(o2) : o1 === o2;
  }

  addTrendingOutfitToCollectionIfMissing<Type extends Pick<ITrendingOutfit, 'id'>>(
    trendingOutfitCollection: Type[],
    ...trendingOutfitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const trendingOutfits: Type[] = trendingOutfitsToCheck.filter(isPresent);
    if (trendingOutfits.length > 0) {
      const trendingOutfitCollectionIdentifiers = trendingOutfitCollection.map(
        trendingOutfitItem => this.getTrendingOutfitIdentifier(trendingOutfitItem)!
      );
      const trendingOutfitsToAdd = trendingOutfits.filter(trendingOutfitItem => {
        const trendingOutfitIdentifier = this.getTrendingOutfitIdentifier(trendingOutfitItem);
        if (trendingOutfitCollectionIdentifiers.includes(trendingOutfitIdentifier)) {
          return false;
        }
        trendingOutfitCollectionIdentifiers.push(trendingOutfitIdentifier);
        return true;
      });
      return [...trendingOutfitsToAdd, ...trendingOutfitCollection];
    }
    return trendingOutfitCollection;
  }
}
