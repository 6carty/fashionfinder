import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SaleListingFormService, SaleListingFormGroup } from './sale-listing-form.service';
import { ISaleListing } from '../sale-listing.model';
import { SaleListingService } from '../service/sale-listing.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-sale-listing-update',
  templateUrl: './sale-listing-update.component.html',
})
export class SaleListingUpdateComponent implements OnInit {
  isSaving = false;
  saleListing: ISaleListing | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: SaleListingFormGroup = this.saleListingFormService.createSaleListingFormGroup();

  constructor(
    protected saleListingService: SaleListingService,
    protected saleListingFormService: SaleListingFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saleListing }) => {
      this.saleListing = saleListing;
      if (saleListing) {
        this.updateForm(saleListing);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const saleListing = this.saleListingFormService.getSaleListing(this.editForm);
    if (saleListing.id !== null) {
      this.subscribeToSaveResponse(this.saleListingService.update(saleListing));
    } else {
      this.subscribeToSaveResponse(this.saleListingService.create(saleListing));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISaleListing>>): void {
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

  protected updateForm(saleListing: ISaleListing): void {
    this.saleListing = saleListing;
    this.saleListingFormService.resetForm(this.editForm, saleListing);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      saleListing.seller
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.saleListing?.seller)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
