import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISaleListing } from '../sale-listing.model';
import { SaleListingService } from '../service/sale-listing.service';

@Injectable({ providedIn: 'root' })
export class SaleListingRoutingResolveService implements Resolve<ISaleListing | null> {
  constructor(protected service: SaleListingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISaleListing | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((saleListing: HttpResponse<ISaleListing>) => {
          if (saleListing.body) {
            return of(saleListing.body);
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
