import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchaseListing, NewPurchaseListing } from '../purchase-listing.model';

export type PartialUpdatePurchaseListing = Partial<IPurchaseListing> & Pick<IPurchaseListing, 'id'>;

export type EntityResponseType = HttpResponse<IPurchaseListing>;
export type EntityArrayResponseType = HttpResponse<IPurchaseListing[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseListingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/purchase-listings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(purchaseListing: NewPurchaseListing): Observable<EntityResponseType> {
    return this.http.post<IPurchaseListing>(this.resourceUrl, purchaseListing, { observe: 'response' });
  }

  update(purchaseListing: IPurchaseListing): Observable<EntityResponseType> {
    return this.http.put<IPurchaseListing>(`${this.resourceUrl}/${this.getPurchaseListingIdentifier(purchaseListing)}`, purchaseListing, {
      observe: 'response',
    });
  }

  partialUpdate(purchaseListing: PartialUpdatePurchaseListing): Observable<EntityResponseType> {
    return this.http.patch<IPurchaseListing>(`${this.resourceUrl}/${this.getPurchaseListingIdentifier(purchaseListing)}`, purchaseListing, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPurchaseListing>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPurchaseListing[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPurchaseListingIdentifier(purchaseListing: Pick<IPurchaseListing, 'id'>): number {
    return purchaseListing.id;
  }

  comparePurchaseListing(o1: Pick<IPurchaseListing, 'id'> | null, o2: Pick<IPurchaseListing, 'id'> | null): boolean {
    return o1 && o2 ? this.getPurchaseListingIdentifier(o1) === this.getPurchaseListingIdentifier(o2) : o1 === o2;
  }

  addPurchaseListingToCollectionIfMissing<Type extends Pick<IPurchaseListing, 'id'>>(
    purchaseListingCollection: Type[],
    ...purchaseListingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const purchaseListings: Type[] = purchaseListingsToCheck.filter(isPresent);
    if (purchaseListings.length > 0) {
      const purchaseListingCollectionIdentifiers = purchaseListingCollection.map(
        purchaseListingItem => this.getPurchaseListingIdentifier(purchaseListingItem)!
      );
      const purchaseListingsToAdd = purchaseListings.filter(purchaseListingItem => {
        const purchaseListingIdentifier = this.getPurchaseListingIdentifier(purchaseListingItem);
        if (purchaseListingCollectionIdentifiers.includes(purchaseListingIdentifier)) {
          return false;
        }
        purchaseListingCollectionIdentifiers.push(purchaseListingIdentifier);
        return true;
      });
      return [...purchaseListingsToAdd, ...purchaseListingCollection];
    }
    return purchaseListingCollection;
  }
}
