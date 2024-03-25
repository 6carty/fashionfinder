import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExchangeRequestFormService, ExchangeRequestFormGroup } from './exchange-request-form.service';
import { IExchangeRequest } from '../exchange-request.model';
import { ExchangeRequestService } from '../service/exchange-request.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { ClothingItemService } from 'app/entities/clothing-item/service/clothing-item.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-exchange-request-update',
  templateUrl: './exchange-request-update.component.html',
})
export class ExchangeRequestUpdateComponent implements OnInit {
  isSaving = false;
  exchangeRequest: IExchangeRequest | null = null;

  clothingItemsSharedCollection: IClothingItem[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: ExchangeRequestFormGroup = this.exchangeRequestFormService.createExchangeRequestFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected exchangeRequestService: ExchangeRequestService,
    protected exchangeRequestFormService: ExchangeRequestFormService,
    protected clothingItemService: ClothingItemService,
    protected userProfileService: UserProfileService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareClothingItem = (o1: IClothingItem | null, o2: IClothingItem | null): boolean =>
    this.clothingItemService.compareClothingItem(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exchangeRequest }) => {
      this.exchangeRequest = exchangeRequest;
      if (exchangeRequest) {
        this.updateForm(exchangeRequest);
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
    const exchangeRequest = this.exchangeRequestFormService.getExchangeRequest(this.editForm);
    if (exchangeRequest.id !== null) {
      this.subscribeToSaveResponse(this.exchangeRequestService.update(exchangeRequest));
    } else {
      this.subscribeToSaveResponse(this.exchangeRequestService.create(exchangeRequest));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExchangeRequest>>): void {
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

  protected updateForm(exchangeRequest: IExchangeRequest): void {
    this.exchangeRequest = exchangeRequest;
    this.exchangeRequestFormService.resetForm(this.editForm, exchangeRequest);

    this.clothingItemsSharedCollection = this.clothingItemService.addClothingItemToCollectionIfMissing<IClothingItem>(
      this.clothingItemsSharedCollection,
      exchangeRequest.clothingItem
    );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      exchangeRequest.requester
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clothingItemService
      .query()
      .pipe(map((res: HttpResponse<IClothingItem[]>) => res.body ?? []))
      .pipe(
        map((clothingItems: IClothingItem[]) =>
          this.clothingItemService.addClothingItemToCollectionIfMissing<IClothingItem>(clothingItems, this.exchangeRequest?.clothingItem)
        )
      )
      .subscribe((clothingItems: IClothingItem[]) => (this.clothingItemsSharedCollection = clothingItems));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.exchangeRequest?.requester)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
