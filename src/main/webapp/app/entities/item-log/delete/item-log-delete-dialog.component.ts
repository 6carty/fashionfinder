import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IItemLog } from '../item-log.model';
import { ItemLogService } from '../service/item-log.service';

@Component({
  standalone: true,
  templateUrl: './item-log-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ItemLogDeleteDialogComponent {
  itemLog?: IItemLog;

  constructor(protected itemLogService: ItemLogService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemLogService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
