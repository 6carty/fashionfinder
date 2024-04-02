import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OutfitFormService, OutfitFormGroup } from './outfit-form.service';
import { IOutfit } from '../outfit.model';
import { OutfitService } from '../service/outfit.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { Occasion } from 'app/entities/enumerations/occasion.model';
import { AccountService } from '../../../core/auth/account.service';
import { RatingService } from '../../rating/service/rating.service';
import { IRating, NewRating } from '../../rating/rating.model';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-outfit-update',
  templateUrl: './outfit-update.component.html',
})
export class OutfitUpdateComponent implements OnInit {
  isSaving = false;
  outfit: IOutfit | null | undefined = null;
  outfitName: string | undefined | null = null;
  active: String | undefined = '';
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  occasionValues = Object.keys(Occasion);

  usersSharedCollection: IUser[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: OutfitFormGroup = this.outfitFormService.createOutfitFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected outfitService: OutfitService,
    protected outfitFormService: OutfitFormService,
    protected userService: UserService,
    protected userProfileService: UserProfileService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected ratingService: RatingService
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ outfit }) => {
      this.outfit = outfit;
      if (outfit) {
        this.updateForm(outfit);
      }

      this.loadRelationshipsOptions();
    });
    this.accountService.getAuthenticationState().subscribe(account => {
      this.active = account?.login;
      if (this.active) {
        this.userService.query().subscribe(usersResponse => {
          this.users = usersResponse.body;
          if (this.users) {
            this.user = this.users.find(user => user.login === this.active);
            console.log('The user is currently', this.user);
          }
        });
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
    const outfit = this.outfitFormService.getOutfit(this.editForm);
    if (outfit.id !== null) {
      const selectedWeatherTags: string[] = [];
      const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="weather"]:checked');
      checkboxes.forEach(function (checkbox) {
        selectedWeatherTags.push(checkbox.value);
      });
      outfit.description = outfit.description?.split(',')[0];
      // Set the collected string as the value for the weather attribute
      outfit.description = outfit.description + ',' + selectedWeatherTags.join(','); // Join the tags into a comma-separated string

      this.subscribeToSaveResponse(this.outfitService.update(outfit));
    } else {
      const selectedWeatherTags: string[] = [];
      const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="weather"]:checked');
      checkboxes.forEach(function (checkbox) {
        selectedWeatherTags.push(checkbox.value);
      });

      // Set the collected string as the value for the weather attribute
      outfit.description = outfit.description + ',' + selectedWeatherTags.join(','); // Join the tags into a comma-separated string
      outfit.userCreated = this.user;
      this.outfitName = outfit.name;
      this.subscribeToSaveResponse(this.outfitService.create(outfit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOutfit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.outfitService.query().subscribe(outfittable => {
      const outfit = outfittable.body?.find(ouftit => this.outfitName === ouftit.name);
      console.log('is a rating getting created as intended', this.outfit);
      const newRating: IRating | NewRating = {
        id: null,
        outfit: outfit,
        ratedAt: dayjs(),
        userRated: this.user,
      };
      this.ratingService.create(newRating).subscribe({
        next: () => {
          console.log('Rating created successfully.');
          // Handle success if needed
        },
        error: err => {
          console.error('Error creating rating:', err);
          // Handle error if needed
        },
      });
    });

    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(outfit: IOutfit): void {
    this.outfit = outfit;
    this.outfitFormService.resetForm(this.editForm, outfit);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, outfit.userCreated);
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      outfit.creator
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.outfit?.userCreated)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.outfit?.creator)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
