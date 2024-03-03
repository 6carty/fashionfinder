import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserMilestone } from '../user-milestone.model';
import { UserMilestoneService } from '../service/user-milestone.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-milestone-delete-dialog.component.html',
})
export class UserMilestoneDeleteDialogComponent {
  userMilestone?: IUserMilestone;

  constructor(protected userMilestoneService: UserMilestoneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userMilestoneService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
