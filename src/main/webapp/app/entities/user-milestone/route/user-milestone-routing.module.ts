import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserMilestoneComponent } from '../list/user-milestone.component';
import { UserMilestoneDetailComponent } from '../detail/user-milestone-detail.component';
import { UserMilestoneUpdateComponent } from '../update/user-milestone-update.component';
import { UserMilestoneRoutingResolveService } from './user-milestone-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userMilestoneRoute: Routes = [
  {
    path: '',
    component: UserMilestoneComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserMilestoneDetailComponent,
    resolve: {
      userMilestone: UserMilestoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserMilestoneUpdateComponent,
    resolve: {
      userMilestone: UserMilestoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserMilestoneUpdateComponent,
    resolve: {
      userMilestone: UserMilestoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userMilestoneRoute)],
  exports: [RouterModule],
})
export class UserMilestoneRoutingModule {}
