import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemLog } from '../item-log.model';
import { ItemLogService } from '../service/item-log.service';

@Injectable({ providedIn: 'root' })
export class ItemLogRoutingResolveService implements Resolve<IItemLog | null> {
  constructor(protected service: ItemLogService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemLog | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemLog: HttpResponse<IItemLog>) => {
          if (itemLog.body) {
            return of(itemLog.body);
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
