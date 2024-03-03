import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExchangeRequestComponent } from '../list/exchange-request.component';
import { ExchangeRequestDetailComponent } from '../detail/exchange-request-detail.component';
import { ExchangeRequestUpdateComponent } from '../update/exchange-request-update.component';
import { ExchangeRequestRoutingResolveService } from './exchange-request-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const exchangeRequestRoute: Routes = [
  {
    path: '',
    component: ExchangeRequestComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExchangeRequestDetailComponent,
    resolve: {
      exchangeRequest: ExchangeRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExchangeRequestUpdateComponent,
    resolve: {
      exchangeRequest: ExchangeRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExchangeRequestUpdateComponent,
    resolve: {
      exchangeRequest: ExchangeRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exchangeRequestRoute)],
  exports: [RouterModule],
})
export class ExchangeRequestRoutingModule {}
