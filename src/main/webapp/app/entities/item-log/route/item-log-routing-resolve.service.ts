import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemLog } from '../item-log.model';
import { ItemLogService } from '../service/item-log.service';

export const itemLogResolve = (route: ActivatedRouteSnapshot): Observable<null | IItemLog> => {
  const id = route.params['id'];
  if (id) {
    return inject(ItemLogService)
      .find(id)
      .pipe(
        mergeMap((itemLog: HttpResponse<IItemLog>) => {
          if (itemLog.body) {
            return of(itemLog.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default itemLogResolve;
