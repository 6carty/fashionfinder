import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClothingPic } from '../clothing-pic.model';
import { ClothingPicService } from '../service/clothing-pic.service';

@Injectable({ providedIn: 'root' })
export class ClothingPicRoutingResolveService implements Resolve<IClothingPic | null> {
  constructor(protected service: ClothingPicService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClothingPic | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((clothingPic: HttpResponse<IClothingPic>) => {
          if (clothingPic.body) {
            return of(clothingPic.body);
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
