import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMilestoneType } from '../milestone-type.model';
import { MilestoneTypeService } from '../service/milestone-type.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './milestone-type-delete-dialog.component.html',
})
export class MilestoneTypeDeleteDialogComponent {
  milestoneType?: IMilestoneType;

  constructor(protected milestoneTypeService: MilestoneTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.milestoneTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
