import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChatroomFormService, ChatroomFormGroup } from './chatroom-form.service';
import { IChatroom } from '../chatroom.model';
import { ChatroomService } from '../service/chatroom.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-chatroom-update',
  templateUrl: './chatroom-update.component.html',
})
export class ChatroomUpdateComponent implements OnInit {
  isSaving = false;
  chatroom: IChatroom | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: ChatroomFormGroup = this.chatroomFormService.createChatroomFormGroup();

  constructor(
    protected chatroomService: ChatroomService,
    protected chatroomFormService: ChatroomFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatroom }) => {
      this.chatroom = chatroom;
      if (chatroom) {
        this.updateForm(chatroom);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chatroom = this.chatroomFormService.getChatroom(this.editForm);
    if (chatroom.id !== null) {
      this.subscribeToSaveResponse(this.chatroomService.update(chatroom));
    } else {
      this.subscribeToSaveResponse(this.chatroomService.create(chatroom));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatroom>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(chatroom: IChatroom): void {
    this.chatroom = chatroom;
    this.chatroomFormService.resetForm(this.editForm, chatroom);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      chatroom.creator,
      chatroom.recipient
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing<IUser>(users, this.chatroom?.creator, this.chatroom?.recipient)
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
