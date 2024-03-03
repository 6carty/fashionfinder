import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChatroom } from '../chatroom.model';
import { ChatroomService } from '../service/chatroom.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './chatroom-delete-dialog.component.html',
})
export class ChatroomDeleteDialogComponent {
  chatroom?: IChatroom;

  constructor(protected chatroomService: ChatroomService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chatroomService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
