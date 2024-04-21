import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ItemLogComponent } from './list/item-log.component';
import { ItemLogDetailComponent } from './detail/item-log-detail.component';
import { ItemLogUpdateComponent } from './update/item-log-update.component';
import ItemLogResolve from './route/item-log-routing-resolve.service';

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
      itemLog: ItemLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemLogUpdateComponent,
    resolve: {
      itemLog: ItemLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemLogUpdateComponent,
    resolve: {
      itemLog: ItemLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default itemLogRoute;
