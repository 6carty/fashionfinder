import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPurchaseListing } from '../purchase-listing.model';
import { PurchaseListingService } from '../service/purchase-listing.service';

@Injectable({ providedIn: 'root' })
export class PurchaseListingRoutingResolveService implements Resolve<IPurchaseListing | null> {
  constructor(protected service: PurchaseListingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPurchaseListing | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((purchaseListing: HttpResponse<IPurchaseListing>) => {
          if (purchaseListing.body) {
            return of(purchaseListing.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
