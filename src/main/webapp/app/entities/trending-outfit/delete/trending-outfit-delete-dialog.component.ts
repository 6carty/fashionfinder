import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrendingOutfit } from '../trending-outfit.model';
import { TrendingOutfitService } from '../service/trending-outfit.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './trending-outfit-delete-dialog.component.html',
})
export class TrendingOutfitDeleteDialogComponent {
  trendingOutfit?: ITrendingOutfit;

  constructor(protected trendingOutfitService: TrendingOutfitService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trendingOutfitService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
