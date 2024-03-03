import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClothingItem } from '../clothing-item.model';
import { ClothingItemService } from '../service/clothing-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './clothing-item-delete-dialog.component.html',
})
export class ClothingItemDeleteDialogComponent {
  clothingItem?: IClothingItem;

  constructor(protected clothingItemService: ClothingItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clothingItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
