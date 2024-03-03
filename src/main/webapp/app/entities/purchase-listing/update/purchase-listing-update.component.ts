import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PurchaseListingFormService, PurchaseListingFormGroup } from './purchase-listing-form.service';
import { IPurchaseListing } from '../purchase-listing.model';
import { PurchaseListingService } from '../service/purchase-listing.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-purchase-listing-update',
  templateUrl: './purchase-listing-update.component.html',
})
export class PurchaseListingUpdateComponent implements OnInit {
  isSaving = false;
  purchaseListing: IPurchaseListing | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: PurchaseListingFormGroup = this.purchaseListingFormService.createPurchaseListingFormGroup();

  constructor(
    protected purchaseListingService: PurchaseListingService,
    protected purchaseListingFormService: PurchaseListingFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseListing }) => {
      this.purchaseListing = purchaseListing;
      if (purchaseListing) {
        this.updateForm(purchaseListing);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseListing = this.purchaseListingFormService.getPurchaseListing(this.editForm);
    if (purchaseListing.id !== null) {
      this.subscribeToSaveResponse(this.purchaseListingService.update(purchaseListing));
    } else {
      this.subscribeToSaveResponse(this.purchaseListingService.create(purchaseListing));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseListing>>): void {
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

  protected updateForm(purchaseListing: IPurchaseListing): void {
    this.purchaseListing = purchaseListing;
    this.purchaseListingFormService.resetForm(this.editForm, purchaseListing);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      purchaseListing.seller
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.purchaseListing?.seller)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
