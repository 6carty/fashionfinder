import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClothingItem } from '../clothing-item.model';
import { ClothingItemService } from '../service/clothing-item.service';

@Injectable({ providedIn: 'root' })
export class ClothingItemRoutingResolveService implements Resolve<IClothingItem | null> {
  constructor(protected service: ClothingItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClothingItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((clothingItem: HttpResponse<IClothingItem>) => {
          if (clothingItem.body) {
            return of(clothingItem.body);
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
