import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChatMessageComponent } from '../list/chat-message.component';
import { ChatMessageDetailComponent } from '../detail/chat-message-detail.component';
import { ChatMessageUpdateComponent } from '../update/chat-message-update.component';
import { ChatMessageRoutingResolveService } from './chat-message-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const chatMessageRoute: Routes = [
  {
    path: '',
    component: ChatMessageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChatMessageDetailComponent,
    resolve: {
      chatMessage: ChatMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChatMessageUpdateComponent,
    resolve: {
      chatMessage: ChatMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChatMessageUpdateComponent,
    resolve: {
      chatMessage: ChatMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chatMessageRoute)],
  exports: [RouterModule],
})
export class ChatMessageRoutingModule {}
