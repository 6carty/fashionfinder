import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ChatroomFormService, ChatroomFormGroup } from './chatroom-form.service';
import { IChatroom } from '../chatroom.model';
import { ChatroomService } from '../service/chatroom.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-chatroom-update',
  templateUrl: './chatroom-update.component.html',
})
export class ChatroomUpdateComponent implements OnInit {
  isSaving = false;
  chatroom: IChatroom | null = null;

  editForm: ChatroomFormGroup = this.chatroomFormService.createChatroomFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected chatroomService: ChatroomService,
    protected chatroomFormService: ChatroomFormService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatroom }) => {
      this.chatroom = chatroom;
      if (chatroom) {
        this.updateForm(chatroom);
      }
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
  }
}
