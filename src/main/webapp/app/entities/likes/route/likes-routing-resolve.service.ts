import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILikes } from '../likes.model';
import { LikesService } from '../service/likes.service';

@Injectable({ providedIn: 'root' })
export class LikesRoutingResolveService implements Resolve<ILikes | null> {
  constructor(protected service: LikesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILikes | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((likes: HttpResponse<ILikes>) => {
          if (likes.body) {
            return of(likes.body);
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
