import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChatroom } from '../chatroom.model';

@Component({
  selector: 'jhi-chatroom-detail',
  templateUrl: './chatroom-detail.component.html',
})
export class ChatroomDetailComponent implements OnInit {
  chatroom: IChatroom | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatroom }) => {
      this.chatroom = chatroom;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
