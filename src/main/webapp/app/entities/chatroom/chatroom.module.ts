import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChatroomComponent } from './list/chatroom.component';
import { ChatroomDetailComponent } from './detail/chatroom-detail.component';
import { ChatroomUpdateComponent } from './update/chatroom-update.component';
import { ChatroomDeleteDialogComponent } from './delete/chatroom-delete-dialog.component';
import { ChatroomRoutingModule } from './route/chatroom-routing.module';

@NgModule({
  imports: [SharedModule, ChatroomRoutingModule],
  declarations: [ChatroomComponent, ChatroomDetailComponent, ChatroomUpdateComponent, ChatroomDeleteDialogComponent],
})
export class ChatroomModule {}
