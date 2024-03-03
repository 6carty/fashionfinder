import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFashionTip } from '../fashion-tip.model';
import { FashionTipService } from '../service/fashion-tip.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './fashion-tip-delete-dialog.component.html',
})
export class FashionTipDeleteDialogComponent {
  fashionTip?: IFashionTip;

  constructor(protected fashionTipService: FashionTipService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fashionTipService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
