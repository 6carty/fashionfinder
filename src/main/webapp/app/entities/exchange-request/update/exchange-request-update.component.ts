import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExchangeRequestFormService, ExchangeRequestFormGroup } from './exchange-request-form.service';
import { IExchangeRequest } from '../exchange-request.model';
import { ExchangeRequestService } from '../service/exchange-request.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-exchange-request-update',
  templateUrl: './exchange-request-update.component.html',
})
export class ExchangeRequestUpdateComponent implements OnInit {
  isSaving = false;
  exchangeRequest: IExchangeRequest | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: ExchangeRequestFormGroup = this.exchangeRequestFormService.createExchangeRequestFormGroup();

  constructor(
    protected exchangeRequestService: ExchangeRequestService,
    protected exchangeRequestFormService: ExchangeRequestFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

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

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      exchangeRequest.requester
    );
  }

  protected loadRelationshipsOptions(): void {
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
