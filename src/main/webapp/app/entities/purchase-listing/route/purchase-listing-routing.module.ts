import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PurchaseListingComponent } from '../list/purchase-listing.component';
import { PurchaseListingDetailComponent } from '../detail/purchase-listing-detail.component';
import { PurchaseListingUpdateComponent } from '../update/purchase-listing-update.component';
import { PurchaseListingRoutingResolveService } from './purchase-listing-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const purchaseListingRoute: Routes = [
  {
    path: '',
    component: PurchaseListingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PurchaseListingDetailComponent,
    resolve: {
      purchaseListing: PurchaseListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PurchaseListingUpdateComponent,
    resolve: {
      purchaseListing: PurchaseListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PurchaseListingUpdateComponent,
    resolve: {
      purchaseListing: PurchaseListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(purchaseListingRoute)],
  exports: [RouterModule],
})
export class PurchaseListingRoutingModule {}
