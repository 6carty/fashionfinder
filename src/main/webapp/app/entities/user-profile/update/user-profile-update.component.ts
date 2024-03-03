import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserProfileFormService, UserProfileFormGroup } from './user-profile-form.service';
import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IChatroom } from 'app/entities/chatroom/chatroom.model';
import { ChatroomService } from 'app/entities/chatroom/service/chatroom.service';
import { Privacy } from 'app/entities/enumerations/privacy.model';

@Component({
  selector: 'jhi-user-profile-update',
  templateUrl: './user-profile-update.component.html',
})
export class UserProfileUpdateComponent implements OnInit {
  isSaving = false;
  userProfile: IUserProfile | null = null;
  privacyValues = Object.keys(Privacy);

  usersSharedCollection: IUser[] = [];
  chatroomsSharedCollection: IChatroom[] = [];

  editForm: UserProfileFormGroup = this.userProfileFormService.createUserProfileFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected userProfileService: UserProfileService,
    protected userProfileFormService: UserProfileFormService,
    protected userService: UserService,
    protected chatroomService: ChatroomService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareChatroom = (o1: IChatroom | null, o2: IChatroom | null): boolean => this.chatroomService.compareChatroom(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.userProfile = userProfile;
      if (userProfile) {
        this.updateForm(userProfile);
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
    const userProfile = this.userProfileFormService.getUserProfile(this.editForm);
    if (userProfile.id !== null) {
      this.subscribeToSaveResponse(this.userProfileService.update(userProfile));
    } else {
      this.subscribeToSaveResponse(this.userProfileService.create(userProfile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserProfile>>): void {
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

  protected updateForm(userProfile: IUserProfile): void {
    this.userProfile = userProfile;
    this.userProfileFormService.resetForm(this.editForm, userProfile);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userProfile.user);
    this.chatroomsSharedCollection = this.chatroomService.addChatroomToCollectionIfMissing<IChatroom>(
      this.chatroomsSharedCollection,
      ...(userProfile.chatrooms ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userProfile?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.chatroomService
      .query()
      .pipe(map((res: HttpResponse<IChatroom[]>) => res.body ?? []))
      .pipe(
        map((chatrooms: IChatroom[]) =>
          this.chatroomService.addChatroomToCollectionIfMissing<IChatroom>(chatrooms, ...(this.userProfile?.chatrooms ?? []))
        )
      )
      .subscribe((chatrooms: IChatroom[]) => (this.chatroomsSharedCollection = chatrooms));
  }
}
