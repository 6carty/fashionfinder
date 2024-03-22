import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChatMessageComponent } from './list/chat-message.component';
import { ChatMessageDetailComponent } from './detail/chat-message-detail.component';
import { ChatMessageUpdateComponent } from './update/chat-message-update.component';
import { ChatMessageDeleteDialogComponent } from './delete/chat-message-delete-dialog.component';
import { ChatMessageRoutingModule } from './route/chat-message-routing.module';

@NgModule({
  imports: [SharedModule, ChatMessageRoutingModule],
  declarations: [ChatMessageComponent, ChatMessageDetailComponent, ChatMessageUpdateComponent, ChatMessageDeleteDialogComponent],
})
export class ChatMessageModule {}
