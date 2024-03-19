import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExchangeRequest, NewExchangeRequest } from '../exchange-request.model';

export type PartialUpdateExchangeRequest = Partial<IExchangeRequest> & Pick<IExchangeRequest, 'id'>;

export type EntityResponseType = HttpResponse<IExchangeRequest>;
export type EntityArrayResponseType = HttpResponse<IExchangeRequest[]>;

@Injectable({ providedIn: 'root' })
export class ExchangeRequestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exchange-requests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(exchangeRequest: NewExchangeRequest): Observable<EntityResponseType> {
    return this.http.post<IExchangeRequest>(this.resourceUrl, exchangeRequest, { observe: 'response' });
  }



  update(exchangeRequest: IExchangeRequest): Observable<EntityResponseType> {
    return this.http.put<IExchangeRequest>(`${this.resourceUrl}/${this.getExchangeRequestIdentifier(exchangeRequest)}`, exchangeRequest, {
      observe: 'response',
    });
  }

  partialUpdate(exchangeRequest: PartialUpdateExchangeRequest): Observable<EntityResponseType> {
    return this.http.patch<IExchangeRequest>(`${this.resourceUrl}/${this.getExchangeRequestIdentifier(exchangeRequest)}`, exchangeRequest, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExchangeRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExchangeRequest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExchangeRequestIdentifier(exchangeRequest: Pick<IExchangeRequest, 'id'>): number {
    return exchangeRequest.id;
  }

  compareExchangeRequest(o1: Pick<IExchangeRequest, 'id'> | null, o2: Pick<IExchangeRequest, 'id'> | null): boolean {
    return o1 && o2 ? this.getExchangeRequestIdentifier(o1) === this.getExchangeRequestIdentifier(o2) : o1 === o2;
  }

  addExchangeRequestToCollectionIfMissing<Type extends Pick<IExchangeRequest, 'id'>>(
    exchangeRequestCollection: Type[],
    ...exchangeRequestsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exchangeRequests: Type[] = exchangeRequestsToCheck.filter(isPresent);
    if (exchangeRequests.length > 0) {
      const exchangeRequestCollectionIdentifiers = exchangeRequestCollection.map(
        exchangeRequestItem => this.getExchangeRequestIdentifier(exchangeRequestItem)!
      );
      const exchangeRequestsToAdd = exchangeRequests.filter(exchangeRequestItem => {
        const exchangeRequestIdentifier = this.getExchangeRequestIdentifier(exchangeRequestItem);
        if (exchangeRequestCollectionIdentifiers.includes(exchangeRequestIdentifier)) {
          return false;
        }
        exchangeRequestCollectionIdentifiers.push(exchangeRequestIdentifier);
        return true;
      });
      return [...exchangeRequestsToAdd, ...exchangeRequestCollection];
    }
    return exchangeRequestCollection;
  }
}
