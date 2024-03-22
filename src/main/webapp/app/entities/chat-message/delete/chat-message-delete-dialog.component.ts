import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChatMessage } from '../chat-message.model';
import { ChatMessageService } from '../service/chat-message.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './chat-message-delete-dialog.component.html',
})
export class ChatMessageDeleteDialogComponent {
  chatMessage?: IChatMessage;

  constructor(protected chatMessageService: ChatMessageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chatMessageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
