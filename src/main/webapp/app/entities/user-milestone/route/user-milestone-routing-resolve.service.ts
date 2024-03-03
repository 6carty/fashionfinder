import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserMilestone } from '../user-milestone.model';
import { UserMilestoneService } from '../service/user-milestone.service';

@Injectable({ providedIn: 'root' })
export class UserMilestoneRoutingResolveService implements Resolve<IUserMilestone | null> {
  constructor(protected service: UserMilestoneService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserMilestone | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userMilestone: HttpResponse<IUserMilestone>) => {
          if (userMilestone.body) {
            return of(userMilestone.body);
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
