import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPurchaseListing } from '../purchase-listing.model';
import { PurchaseListingService } from '../service/purchase-listing.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './purchase-listing-delete-dialog.component.html',
})
export class PurchaseListingDeleteDialogComponent {
  purchaseListing?: IPurchaseListing;

  constructor(protected purchaseListingService: PurchaseListingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.purchaseListingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
