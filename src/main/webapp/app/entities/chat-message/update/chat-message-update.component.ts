import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChatMessageFormService, ChatMessageFormGroup } from './chat-message-form.service';
import { IChatMessage } from '../chat-message.model';
import { ChatMessageService } from '../service/chat-message.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IChatroom } from 'app/entities/chatroom/chatroom.model';
import { ChatroomService } from 'app/entities/chatroom/service/chatroom.service';

@Component({
  selector: 'jhi-chat-message-update',
  templateUrl: './chat-message-update.component.html',
})
export class ChatMessageUpdateComponent implements OnInit {
  isSaving = false;
  chatMessage: IChatMessage | null = null;

  usersSharedCollection: IUser[] = [];
  chatroomsSharedCollection: IChatroom[] = [];

  editForm: ChatMessageFormGroup = this.chatMessageFormService.createChatMessageFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected chatMessageService: ChatMessageService,
    protected chatMessageFormService: ChatMessageFormService,
    protected userService: UserService,
    protected chatroomService: ChatroomService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareChatroom = (o1: IChatroom | null, o2: IChatroom | null): boolean => this.chatroomService.compareChatroom(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatMessage }) => {
      this.chatMessage = chatMessage;
      if (chatMessage) {
        this.updateForm(chatMessage);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chatMessage = this.chatMessageFormService.getChatMessage(this.editForm);
    if (chatMessage.id !== null) {
      this.subscribeToSaveResponse(this.chatMessageService.update(chatMessage));
    } else {
      this.subscribeToSaveResponse(this.chatMessageService.create(chatMessage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatMessage>>): void {
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

  protected updateForm(chatMessage: IChatMessage): void {
    this.chatMessage = chatMessage;
    this.chatMessageFormService.resetForm(this.editForm, chatMessage);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, chatMessage.sender);
    this.chatroomsSharedCollection = this.chatroomService.addChatroomToCollectionIfMissing<IChatroom>(
      this.chatroomsSharedCollection,
      chatMessage.chatroom
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.chatMessage?.sender)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.chatroomService
      .query()
      .pipe(map((res: HttpResponse<IChatroom[]>) => res.body ?? []))
      .pipe(
        map((chatrooms: IChatroom[]) =>
          this.chatroomService.addChatroomToCollectionIfMissing<IChatroom>(chatrooms, this.chatMessage?.chatroom)
        )
      )
      .subscribe((chatrooms: IChatroom[]) => (this.chatroomsSharedCollection = chatrooms));
  }
}
