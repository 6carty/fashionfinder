import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LikesComponent } from '../list/likes.component';
import { LikesDetailComponent } from '../detail/likes-detail.component';
import { LikesUpdateComponent } from '../update/likes-update.component';
import { LikesRoutingResolveService } from './likes-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const likesRoute: Routes = [
  {
    path: '',
    component: LikesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LikesDetailComponent,
    resolve: {
      likes: LikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LikesUpdateComponent,
    resolve: {
      likes: LikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LikesUpdateComponent,
    resolve: {
      likes: LikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(likesRoute)],
  exports: [RouterModule],
})
export class LikesRoutingModule {}
