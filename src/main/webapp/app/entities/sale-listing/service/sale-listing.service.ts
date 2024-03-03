import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISaleListing, NewSaleListing } from '../sale-listing.model';

export type PartialUpdateSaleListing = Partial<ISaleListing> & Pick<ISaleListing, 'id'>;

export type EntityResponseType = HttpResponse<ISaleListing>;
export type EntityArrayResponseType = HttpResponse<ISaleListing[]>;

@Injectable({ providedIn: 'root' })
export class SaleListingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sale-listings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(saleListing: NewSaleListing): Observable<EntityResponseType> {
    return this.http.post<ISaleListing>(this.resourceUrl, saleListing, { observe: 'response' });
  }

  update(saleListing: ISaleListing): Observable<EntityResponseType> {
    return this.http.put<ISaleListing>(`${this.resourceUrl}/${this.getSaleListingIdentifier(saleListing)}`, saleListing, {
      observe: 'response',
    });
  }

  partialUpdate(saleListing: PartialUpdateSaleListing): Observable<EntityResponseType> {
    return this.http.patch<ISaleListing>(`${this.resourceUrl}/${this.getSaleListingIdentifier(saleListing)}`, saleListing, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISaleListing>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISaleListing[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSaleListingIdentifier(saleListing: Pick<ISaleListing, 'id'>): number {
    return saleListing.id;
  }

  compareSaleListing(o1: Pick<ISaleListing, 'id'> | null, o2: Pick<ISaleListing, 'id'> | null): boolean {
    return o1 && o2 ? this.getSaleListingIdentifier(o1) === this.getSaleListingIdentifier(o2) : o1 === o2;
  }

  addSaleListingToCollectionIfMissing<Type extends Pick<ISaleListing, 'id'>>(
    saleListingCollection: Type[],
    ...saleListingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const saleListings: Type[] = saleListingsToCheck.filter(isPresent);
    if (saleListings.length > 0) {
      const saleListingCollectionIdentifiers = saleListingCollection.map(
        saleListingItem => this.getSaleListingIdentifier(saleListingItem)!
      );
      const saleListingsToAdd = saleListings.filter(saleListingItem => {
        const saleListingIdentifier = this.getSaleListingIdentifier(saleListingItem);
        if (saleListingCollectionIdentifiers.includes(saleListingIdentifier)) {
          return false;
        }
        saleListingCollectionIdentifiers.push(saleListingIdentifier);
        return true;
      });
      return [...saleListingsToAdd, ...saleListingCollection];
    }
    return saleListingCollection;
  }
}
