import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ClothingItemFormService, ClothingItemFormGroup } from './clothing-item-form.service';
import { IClothingItem } from '../clothing-item.model';
import { ClothingItemService } from '../service/clothing-item.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { ClothingType } from 'app/entities/enumerations/clothing-type.model';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-clothing-item-update',
  templateUrl: './clothing-item-update.component.html',
})
export class ClothingItemUpdateComponent implements OnInit {
  isSaving = false;
  clothingItem: IClothingItem | null = null;
  clothingTypeValues = Object.keys(ClothingType);
  statusValues = Object.keys(Status);

  eventsSharedCollection: IEvent[] = [];
  outfitsSharedCollection: IOutfit[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: ClothingItemFormGroup = this.clothingItemFormService.createClothingItemFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected clothingItemService: ClothingItemService,
    protected clothingItemFormService: ClothingItemFormService,
    protected eventService: EventService,
    protected outfitService: OutfitService,
    protected userProfileService: UserProfileService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  compareOutfit = (o1: IOutfit | null, o2: IOutfit | null): boolean => this.outfitService.compareOutfit(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clothingItem }) => {
      this.clothingItem = clothingItem;
      if (clothingItem) {
        this.updateForm(clothingItem);
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
    const clothingItem = this.clothingItemFormService.getClothingItem(this.editForm);
    if (clothingItem.id !== null) {
      this.subscribeToSaveResponse(this.clothingItemService.update(clothingItem));
    } else {
      this.subscribeToSaveResponse(this.clothingItemService.create(clothingItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClothingItem>>): void {
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

  protected updateForm(clothingItem: IClothingItem): void {
    this.clothingItem = clothingItem;
    this.clothingItemFormService.resetForm(this.editForm, clothingItem);

    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing<IEvent>(this.eventsSharedCollection, clothingItem.event);
    this.outfitsSharedCollection = this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(
      this.outfitsSharedCollection,
      ...(clothingItem.outfits ?? [])
    );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      clothingItem.owner
    );
  }

  protected loadRelationshipsOptions(): void {
    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing<IEvent>(events, this.clothingItem?.event)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.outfitService
      .query()
      .pipe(map((res: HttpResponse<IOutfit[]>) => res.body ?? []))
      .pipe(
        map((outfits: IOutfit[]) =>
          this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(outfits, ...(this.clothingItem?.outfits ?? []))
        )
      )
      .subscribe((outfits: IOutfit[]) => (this.outfitsSharedCollection = outfits));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.clothingItem?.owner)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
