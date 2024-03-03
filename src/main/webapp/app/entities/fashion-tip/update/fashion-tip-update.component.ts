import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FashionTipFormService, FashionTipFormGroup } from './fashion-tip-form.service';
import { IFashionTip } from '../fashion-tip.model';
import { FashionTipService } from '../service/fashion-tip.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-fashion-tip-update',
  templateUrl: './fashion-tip-update.component.html',
})
export class FashionTipUpdateComponent implements OnInit {
  isSaving = false;
  fashionTip: IFashionTip | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: FashionTipFormGroup = this.fashionTipFormService.createFashionTipFormGroup();

  constructor(
    protected fashionTipService: FashionTipService,
    protected fashionTipFormService: FashionTipFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fashionTip }) => {
      this.fashionTip = fashionTip;
      if (fashionTip) {
        this.updateForm(fashionTip);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fashionTip = this.fashionTipFormService.getFashionTip(this.editForm);
    if (fashionTip.id !== null) {
      this.subscribeToSaveResponse(this.fashionTipService.update(fashionTip));
    } else {
      this.subscribeToSaveResponse(this.fashionTipService.create(fashionTip));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFashionTip>>): void {
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

  protected updateForm(fashionTip: IFashionTip): void {
    this.fashionTip = fashionTip;
    this.fashionTipFormService.resetForm(this.editForm, fashionTip);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      fashionTip.author
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.fashionTip?.author)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
