import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOutfitPic } from '../outfit-pic.model';
import { OutfitPicService } from '../service/outfit-pic.service';

@Injectable({ providedIn: 'root' })
export class OutfitPicRoutingResolveService implements Resolve<IOutfitPic | null> {
  constructor(protected service: OutfitPicService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOutfitPic | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((outfitPic: HttpResponse<IOutfitPic>) => {
          if (outfitPic.body) {
            return of(outfitPic.body);
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
