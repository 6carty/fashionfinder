import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserMilestoneFormService, UserMilestoneFormGroup } from './user-milestone-form.service';
import { IUserMilestone } from '../user-milestone.model';
import { UserMilestoneService } from '../service/user-milestone.service';
import { IMilestoneType } from 'app/entities/milestone-type/milestone-type.model';
import { MilestoneTypeService } from 'app/entities/milestone-type/service/milestone-type.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-user-milestone-update',
  templateUrl: './user-milestone-update.component.html',
})
export class UserMilestoneUpdateComponent implements OnInit {
  isSaving = false;
  userMilestone: IUserMilestone | null = null;

  milestoneTypesSharedCollection: IMilestoneType[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: UserMilestoneFormGroup = this.userMilestoneFormService.createUserMilestoneFormGroup();

  constructor(
    protected userMilestoneService: UserMilestoneService,
    protected userMilestoneFormService: UserMilestoneFormService,
    protected milestoneTypeService: MilestoneTypeService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMilestoneType = (o1: IMilestoneType | null, o2: IMilestoneType | null): boolean =>
    this.milestoneTypeService.compareMilestoneType(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userMilestone }) => {
      this.userMilestone = userMilestone;
      if (userMilestone) {
        this.updateForm(userMilestone);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userMilestone = this.userMilestoneFormService.getUserMilestone(this.editForm);
    if (userMilestone.id !== null) {
      this.subscribeToSaveResponse(this.userMilestoneService.update(userMilestone));
    } else {
      this.subscribeToSaveResponse(this.userMilestoneService.create(userMilestone));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserMilestone>>): void {
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

  protected updateForm(userMilestone: IUserMilestone): void {
    this.userMilestone = userMilestone;
    this.userMilestoneFormService.resetForm(this.editForm, userMilestone);

    this.milestoneTypesSharedCollection = this.milestoneTypeService.addMilestoneTypeToCollectionIfMissing<IMilestoneType>(
      this.milestoneTypesSharedCollection,
      userMilestone.milestoneType
    );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      userMilestone.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.milestoneTypeService
      .query()
      .pipe(map((res: HttpResponse<IMilestoneType[]>) => res.body ?? []))
      .pipe(
        map((milestoneTypes: IMilestoneType[]) =>
          this.milestoneTypeService.addMilestoneTypeToCollectionIfMissing<IMilestoneType>(milestoneTypes, this.userMilestone?.milestoneType)
        )
      )
      .subscribe((milestoneTypes: IMilestoneType[]) => (this.milestoneTypesSharedCollection = milestoneTypes));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.userMilestone?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
