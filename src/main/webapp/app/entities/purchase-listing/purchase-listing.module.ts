import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PurchaseListingComponent } from './list/purchase-listing.component';
import { PurchaseListingDetailComponent } from './detail/purchase-listing-detail.component';
import { PurchaseListingUpdateComponent } from './update/purchase-listing-update.component';
import { PurchaseListingDeleteDialogComponent } from './delete/purchase-listing-delete-dialog.component';
import { PurchaseListingRoutingModule } from './route/purchase-listing-routing.module';

@NgModule({
  imports: [SharedModule, PurchaseListingRoutingModule],
  declarations: [
    PurchaseListingComponent,
    PurchaseListingDetailComponent,
    PurchaseListingUpdateComponent,
    PurchaseListingDeleteDialogComponent,
  ],
})
export class PurchaseListingModule {}
