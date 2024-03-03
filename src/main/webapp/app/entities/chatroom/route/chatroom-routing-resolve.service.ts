import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChatroom } from '../chatroom.model';
import { ChatroomService } from '../service/chatroom.service';

@Injectable({ providedIn: 'root' })
export class ChatroomRoutingResolveService implements Resolve<IChatroom | null> {
  constructor(protected service: ChatroomService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChatroom | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chatroom: HttpResponse<IChatroom>) => {
          if (chatroom.body) {
            return of(chatroom.body);
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
