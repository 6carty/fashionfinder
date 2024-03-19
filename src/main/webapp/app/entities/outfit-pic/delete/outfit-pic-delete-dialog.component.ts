import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOutfitPic } from '../outfit-pic.model';
import { OutfitPicService } from '../service/outfit-pic.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './outfit-pic-delete-dialog.component.html',
})
export class OutfitPicDeleteDialogComponent {
  outfitPic?: IOutfitPic;

  constructor(protected outfitPicService: OutfitPicService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.outfitPicService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
