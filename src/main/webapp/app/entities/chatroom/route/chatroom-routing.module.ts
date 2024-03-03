import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChatroomComponent } from '../list/chatroom.component';
import { ChatroomDetailComponent } from '../detail/chatroom-detail.component';
import { ChatroomUpdateComponent } from '../update/chatroom-update.component';
import { ChatroomRoutingResolveService } from './chatroom-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const chatroomRoute: Routes = [
  {
    path: '',
    component: ChatroomComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChatroomDetailComponent,
    resolve: {
      chatroom: ChatroomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChatroomUpdateComponent,
    resolve: {
      chatroom: ChatroomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChatroomUpdateComponent,
    resolve: {
      chatroom: ChatroomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chatroomRoute)],
  exports: [RouterModule],
})
export class ChatroomRoutingModule {}
