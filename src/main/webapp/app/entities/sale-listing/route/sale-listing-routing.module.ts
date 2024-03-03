import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SaleListingComponent } from '../list/sale-listing.component';
import { SaleListingDetailComponent } from '../detail/sale-listing-detail.component';
import { SaleListingUpdateComponent } from '../update/sale-listing-update.component';
import { SaleListingRoutingResolveService } from './sale-listing-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const saleListingRoute: Routes = [
  {
    path: '',
    component: SaleListingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SaleListingDetailComponent,
    resolve: {
      saleListing: SaleListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SaleListingUpdateComponent,
    resolve: {
      saleListing: SaleListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SaleListingUpdateComponent,
    resolve: {
      saleListing: SaleListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(saleListingRoute)],
  exports: [RouterModule],
})
export class SaleListingRoutingModule {}
