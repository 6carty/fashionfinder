import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITrendingOutfit } from '../trending-outfit.model';
import { TrendingOutfitService } from '../service/trending-outfit.service';

@Injectable({ providedIn: 'root' })
export class TrendingOutfitRoutingResolveService implements Resolve<ITrendingOutfit | null> {
  constructor(protected service: TrendingOutfitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrendingOutfit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((trendingOutfit: HttpResponse<ITrendingOutfit>) => {
          if (trendingOutfit.body) {
            return of(trendingOutfit.body);
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
