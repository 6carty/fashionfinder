import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClothingPic } from '../clothing-pic.model';
import { ClothingPicService } from '../service/clothing-pic.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './clothing-pic-delete-dialog.component.html',
})
export class ClothingPicDeleteDialogComponent {
  clothingPic?: IClothingPic;

  constructor(protected clothingPicService: ClothingPicService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clothingPicService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
