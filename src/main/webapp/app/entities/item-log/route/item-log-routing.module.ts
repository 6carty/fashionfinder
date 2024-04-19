import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemLogComponent } from '../list/item-log.component';
import { ItemLogDetailComponent } from '../detail/item-log-detail.component';
import { ItemLogUpdateComponent } from '../update/item-log-update.component';
import { ItemLogRoutingResolveService } from './item-log-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemLogRoute: Routes = [
  {
    path: '',
    component: ItemLogComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemLogDetailComponent,
    resolve: {
      itemLog: ItemLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemLogUpdateComponent,
    resolve: {
      itemLog: ItemLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemLogUpdateComponent,
    resolve: {
      itemLog: ItemLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemLogRoute)],
  exports: [RouterModule],
})
export class ItemLogRoutingModule {}
