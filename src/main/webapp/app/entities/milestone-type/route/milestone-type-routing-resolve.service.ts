import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMilestoneType } from '../milestone-type.model';
import { MilestoneTypeService } from '../service/milestone-type.service';

@Injectable({ providedIn: 'root' })
export class MilestoneTypeRoutingResolveService implements Resolve<IMilestoneType | null> {
  constructor(protected service: MilestoneTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMilestoneType | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((milestoneType: HttpResponse<IMilestoneType>) => {
          if (milestoneType.body) {
            return of(milestoneType.body);
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
