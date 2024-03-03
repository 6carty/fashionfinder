import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MilestoneTypeComponent } from '../list/milestone-type.component';
import { MilestoneTypeDetailComponent } from '../detail/milestone-type-detail.component';
import { MilestoneTypeUpdateComponent } from '../update/milestone-type-update.component';
import { MilestoneTypeRoutingResolveService } from './milestone-type-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const milestoneTypeRoute: Routes = [
  {
    path: '',
    component: MilestoneTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MilestoneTypeDetailComponent,
    resolve: {
      milestoneType: MilestoneTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MilestoneTypeUpdateComponent,
    resolve: {
      milestoneType: MilestoneTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MilestoneTypeUpdateComponent,
    resolve: {
      milestoneType: MilestoneTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(milestoneTypeRoute)],
  exports: [RouterModule],
})
export class MilestoneTypeRoutingModule {}
