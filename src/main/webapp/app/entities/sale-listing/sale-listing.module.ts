import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SaleListingComponent } from './list/sale-listing.component';
import { SaleListingDetailComponent } from './detail/sale-listing-detail.component';
import { SaleListingUpdateComponent } from './update/sale-listing-update.component';
import { SaleListingDeleteDialogComponent } from './delete/sale-listing-delete-dialog.component';
import { SaleListingRoutingModule } from './route/sale-listing-routing.module';

@NgModule({
  imports: [SharedModule, SaleListingRoutingModule],
  declarations: [SaleListingComponent, SaleListingDetailComponent, SaleListingUpdateComponent, SaleListingDeleteDialogComponent],
})
export class SaleListingModule {}
