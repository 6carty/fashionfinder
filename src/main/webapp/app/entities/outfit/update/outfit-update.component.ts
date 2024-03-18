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
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { Occasion } from 'app/entities/enumerations/occasion.model';

@Component({
  selector: 'jhi-outfit-update',
  templateUrl: './outfit-update.component.html',
})
export class OutfitUpdateComponent implements OnInit {
  isSaving = false;
  outfit: IOutfit | null = null;
  occasionValues = Object.keys(Occasion);

  ratingsCollection: IRating[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: OutfitFormGroup = this.outfitFormService.createOutfitFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected outfitService: OutfitService,
    protected outfitFormService: OutfitFormService,
    protected ratingService: RatingService,
    protected userProfileService: UserProfileService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRating = (o1: IRating | null, o2: IRating | null): boolean => this.ratingService.compareRating(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ outfit }) => {
      this.outfit = outfit;
      if (outfit) {
        this.updateForm(outfit);
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
    const outfit = this.outfitFormService.getOutfit(this.editForm);
    if (outfit.id !== null) {
      this.subscribeToSaveResponse(this.outfitService.update(outfit));
    } else {
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

    this.ratingsCollection = this.ratingService.addRatingToCollectionIfMissing<IRating>(this.ratingsCollection, outfit.rating);
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      outfit.creator
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ratingService
      .query({ filter: 'outfit-is-null' })
      .pipe(map((res: HttpResponse<IRating[]>) => res.body ?? []))
      .pipe(map((ratings: IRating[]) => this.ratingService.addRatingToCollectionIfMissing<IRating>(ratings, this.outfit?.rating)))
      .subscribe((ratings: IRating[]) => (this.ratingsCollection = ratings));

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
