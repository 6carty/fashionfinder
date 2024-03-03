import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFashionTip } from '../fashion-tip.model';
import { FashionTipService } from '../service/fashion-tip.service';

@Injectable({ providedIn: 'root' })
export class FashionTipRoutingResolveService implements Resolve<IFashionTip | null> {
  constructor(protected service: FashionTipService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFashionTip | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fashionTip: HttpResponse<IFashionTip>) => {
          if (fashionTip.body) {
            return of(fashionTip.body);
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
