import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExchangeRequest } from '../exchange-request.model';
import { ExchangeRequestService } from '../service/exchange-request.service';

@Injectable({ providedIn: 'root' })
export class ExchangeRequestRoutingResolveService implements Resolve<IExchangeRequest | null> {
  constructor(protected service: ExchangeRequestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExchangeRequest | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exchangeRequest: HttpResponse<IExchangeRequest>) => {
          if (exchangeRequest.body) {
            return of(exchangeRequest.body);
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
