import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISaleListing } from '../sale-listing.model';
import { SaleListingService } from '../service/sale-listing.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sale-listing-delete-dialog.component.html',
})
export class SaleListingDeleteDialogComponent {
  saleListing?: ISaleListing;

  constructor(protected saleListingService: SaleListingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.saleListingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
