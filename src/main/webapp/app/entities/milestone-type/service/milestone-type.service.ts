import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMilestoneType, NewMilestoneType } from '../milestone-type.model';

export type PartialUpdateMilestoneType = Partial<IMilestoneType> & Pick<IMilestoneType, 'id'>;

export type EntityResponseType = HttpResponse<IMilestoneType>;
export type EntityArrayResponseType = HttpResponse<IMilestoneType[]>;

@Injectable({ providedIn: 'root' })
export class MilestoneTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/milestone-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(milestoneType: NewMilestoneType): Observable<EntityResponseType> {
    return this.http.post<IMilestoneType>(this.resourceUrl, milestoneType, { observe: 'response' });
  }

  update(milestoneType: IMilestoneType): Observable<EntityResponseType> {
    return this.http.put<IMilestoneType>(`${this.resourceUrl}/${this.getMilestoneTypeIdentifier(milestoneType)}`, milestoneType, {
      observe: 'response',
    });
  }

  partialUpdate(milestoneType: PartialUpdateMilestoneType): Observable<EntityResponseType> {
    return this.http.patch<IMilestoneType>(`${this.resourceUrl}/${this.getMilestoneTypeIdentifier(milestoneType)}`, milestoneType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMilestoneType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMilestoneType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMilestoneTypeIdentifier(milestoneType: Pick<IMilestoneType, 'id'>): number {
    return milestoneType.id;
  }

  compareMilestoneType(o1: Pick<IMilestoneType, 'id'> | null, o2: Pick<IMilestoneType, 'id'> | null): boolean {
    return o1 && o2 ? this.getMilestoneTypeIdentifier(o1) === this.getMilestoneTypeIdentifier(o2) : o1 === o2;
  }

  addMilestoneTypeToCollectionIfMissing<Type extends Pick<IMilestoneType, 'id'>>(
    milestoneTypeCollection: Type[],
    ...milestoneTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const milestoneTypes: Type[] = milestoneTypesToCheck.filter(isPresent);
    if (milestoneTypes.length > 0) {
      const milestoneTypeCollectionIdentifiers = milestoneTypeCollection.map(
        milestoneTypeItem => this.getMilestoneTypeIdentifier(milestoneTypeItem)!
      );
      const milestoneTypesToAdd = milestoneTypes.filter(milestoneTypeItem => {
        const milestoneTypeIdentifier = this.getMilestoneTypeIdentifier(milestoneTypeItem);
        if (milestoneTypeCollectionIdentifiers.includes(milestoneTypeIdentifier)) {
          return false;
        }
        milestoneTypeCollectionIdentifiers.push(milestoneTypeIdentifier);
        return true;
      });
      return [...milestoneTypesToAdd, ...milestoneTypeCollection];
    }
    return milestoneTypeCollection;
  }
}
