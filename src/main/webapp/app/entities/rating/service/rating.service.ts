import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRating, NewRating } from '../rating.model';

export type PartialUpdateRating = Partial<IRating> & Pick<IRating, 'id'>;

type RestOf<T extends IRating | NewRating> = Omit<T, 'ratedAt'> & {
  ratedAt?: string | null;
};

export type RestRating = RestOf<IRating>;

export type NewRestRating = RestOf<NewRating>;

export type PartialUpdateRestRating = RestOf<PartialUpdateRating>;

export type EntityResponseType = HttpResponse<IRating>;
export type EntityArrayResponseType = HttpResponse<IRating[]>;

@Injectable({ providedIn: 'root' })
export class RatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rating: NewRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rating);
    return this.http
      .post<RestRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(rating: IRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rating);
    return this.http
      .put<RestRating>(`${this.resourceUrl}/${this.getRatingIdentifier(rating)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(rating: PartialUpdateRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rating);
    return this.http
      .patch<RestRating>(`${this.resourceUrl}/${this.getRatingIdentifier(rating)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRatingIdentifier(rating: Pick<IRating, 'id'>): number {
    return rating.id;
  }

  compareRating(o1: Pick<IRating, 'id'> | null, o2: Pick<IRating, 'id'> | null): boolean {
    return o1 && o2 ? this.getRatingIdentifier(o1) === this.getRatingIdentifier(o2) : o1 === o2;
  }

  addRatingToCollectionIfMissing<Type extends Pick<IRating, 'id'>>(
    ratingCollection: Type[],
    ...ratingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ratings: Type[] = ratingsToCheck.filter(isPresent);
    if (ratings.length > 0) {
      const ratingCollectionIdentifiers = ratingCollection.map(ratingItem => this.getRatingIdentifier(ratingItem)!);
      const ratingsToAdd = ratings.filter(ratingItem => {
        const ratingIdentifier = this.getRatingIdentifier(ratingItem);
        if (ratingCollectionIdentifiers.includes(ratingIdentifier)) {
          return false;
        }
        ratingCollectionIdentifiers.push(ratingIdentifier);
        return true;
      });
      return [...ratingsToAdd, ...ratingCollection];
    }
    return ratingCollection;
  }

  protected convertDateFromClient<T extends IRating | NewRating | PartialUpdateRating>(rating: T): RestOf<T> {
    return {
      ...rating,
      ratedAt: rating.ratedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRating: RestRating): IRating {
    return {
      ...restRating,
      ratedAt: restRating.ratedAt ? dayjs(restRating.ratedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRating>): HttpResponse<IRating> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRating[]>): HttpResponse<IRating[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
