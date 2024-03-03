import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserMilestone, NewUserMilestone } from '../user-milestone.model';

export type PartialUpdateUserMilestone = Partial<IUserMilestone> & Pick<IUserMilestone, 'id'>;

type RestOf<T extends IUserMilestone | NewUserMilestone> = Omit<T, 'unlockedDate'> & {
  unlockedDate?: string | null;
};

export type RestUserMilestone = RestOf<IUserMilestone>;

export type NewRestUserMilestone = RestOf<NewUserMilestone>;

export type PartialUpdateRestUserMilestone = RestOf<PartialUpdateUserMilestone>;

export type EntityResponseType = HttpResponse<IUserMilestone>;
export type EntityArrayResponseType = HttpResponse<IUserMilestone[]>;

@Injectable({ providedIn: 'root' })
export class UserMilestoneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-milestones');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userMilestone: NewUserMilestone): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userMilestone);
    return this.http
      .post<RestUserMilestone>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userMilestone: IUserMilestone): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userMilestone);
    return this.http
      .put<RestUserMilestone>(`${this.resourceUrl}/${this.getUserMilestoneIdentifier(userMilestone)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(userMilestone: PartialUpdateUserMilestone): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userMilestone);
    return this.http
      .patch<RestUserMilestone>(`${this.resourceUrl}/${this.getUserMilestoneIdentifier(userMilestone)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUserMilestone>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserMilestone[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserMilestoneIdentifier(userMilestone: Pick<IUserMilestone, 'id'>): number {
    return userMilestone.id;
  }

  compareUserMilestone(o1: Pick<IUserMilestone, 'id'> | null, o2: Pick<IUserMilestone, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserMilestoneIdentifier(o1) === this.getUserMilestoneIdentifier(o2) : o1 === o2;
  }

  addUserMilestoneToCollectionIfMissing<Type extends Pick<IUserMilestone, 'id'>>(
    userMilestoneCollection: Type[],
    ...userMilestonesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userMilestones: Type[] = userMilestonesToCheck.filter(isPresent);
    if (userMilestones.length > 0) {
      const userMilestoneCollectionIdentifiers = userMilestoneCollection.map(
        userMilestoneItem => this.getUserMilestoneIdentifier(userMilestoneItem)!
      );
      const userMilestonesToAdd = userMilestones.filter(userMilestoneItem => {
        const userMilestoneIdentifier = this.getUserMilestoneIdentifier(userMilestoneItem);
        if (userMilestoneCollectionIdentifiers.includes(userMilestoneIdentifier)) {
          return false;
        }
        userMilestoneCollectionIdentifiers.push(userMilestoneIdentifier);
        return true;
      });
      return [...userMilestonesToAdd, ...userMilestoneCollection];
    }
    return userMilestoneCollection;
  }

  protected convertDateFromClient<T extends IUserMilestone | NewUserMilestone | PartialUpdateUserMilestone>(userMilestone: T): RestOf<T> {
    return {
      ...userMilestone,
      unlockedDate: userMilestone.unlockedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUserMilestone: RestUserMilestone): IUserMilestone {
    return {
      ...restUserMilestone,
      unlockedDate: restUserMilestone.unlockedDate ? dayjs(restUserMilestone.unlockedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUserMilestone>): HttpResponse<IUserMilestone> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUserMilestone[]>): HttpResponse<IUserMilestone[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
