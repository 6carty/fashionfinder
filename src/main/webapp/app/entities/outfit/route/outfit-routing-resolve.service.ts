import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOutfit } from '../outfit.model';
import { OutfitService } from '../service/outfit.service';

@Injectable({ providedIn: 'root' })
export class OutfitRoutingResolveService implements Resolve<IOutfit | null> {
  constructor(protected service: OutfitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOutfit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((outfit: HttpResponse<IOutfit>) => {
          if (outfit.body) {
            return of(outfit.body);
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
