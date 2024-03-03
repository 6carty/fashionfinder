import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILikes, NewLikes } from '../likes.model';

export type PartialUpdateLikes = Partial<ILikes> & Pick<ILikes, 'id'>;

type RestOf<T extends ILikes | NewLikes> = Omit<T, 'likedAt'> & {
  likedAt?: string | null;
};

export type RestLikes = RestOf<ILikes>;

export type NewRestLikes = RestOf<NewLikes>;

export type PartialUpdateRestLikes = RestOf<PartialUpdateLikes>;

export type EntityResponseType = HttpResponse<ILikes>;
export type EntityArrayResponseType = HttpResponse<ILikes[]>;

@Injectable({ providedIn: 'root' })
export class LikesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/likes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(likes: NewLikes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(likes);
    return this.http.post<RestLikes>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(likes: ILikes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(likes);
    return this.http
      .put<RestLikes>(`${this.resourceUrl}/${this.getLikesIdentifier(likes)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(likes: PartialUpdateLikes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(likes);
    return this.http
      .patch<RestLikes>(`${this.resourceUrl}/${this.getLikesIdentifier(likes)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLikes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLikes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLikesIdentifier(likes: Pick<ILikes, 'id'>): number {
    return likes.id;
  }

  compareLikes(o1: Pick<ILikes, 'id'> | null, o2: Pick<ILikes, 'id'> | null): boolean {
    return o1 && o2 ? this.getLikesIdentifier(o1) === this.getLikesIdentifier(o2) : o1 === o2;
  }

  addLikesToCollectionIfMissing<Type extends Pick<ILikes, 'id'>>(
    likesCollection: Type[],
    ...likesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const likes: Type[] = likesToCheck.filter(isPresent);
    if (likes.length > 0) {
      const likesCollectionIdentifiers = likesCollection.map(likesItem => this.getLikesIdentifier(likesItem)!);
      const likesToAdd = likes.filter(likesItem => {
        const likesIdentifier = this.getLikesIdentifier(likesItem);
        if (likesCollectionIdentifiers.includes(likesIdentifier)) {
          return false;
        }
        likesCollectionIdentifiers.push(likesIdentifier);
        return true;
      });
      return [...likesToAdd, ...likesCollection];
    }
    return likesCollection;
  }

  protected convertDateFromClient<T extends ILikes | NewLikes | PartialUpdateLikes>(likes: T): RestOf<T> {
    return {
      ...likes,
      likedAt: likes.likedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLikes: RestLikes): ILikes {
    return {
      ...restLikes,
      likedAt: restLikes.likedAt ? dayjs(restLikes.likedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLikes>): HttpResponse<ILikes> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLikes[]>): HttpResponse<ILikes[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
