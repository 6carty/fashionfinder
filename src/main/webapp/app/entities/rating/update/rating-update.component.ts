import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RatingFormService, RatingFormGroup } from './rating-form.service';
import { IRating } from '../rating.model';
import { RatingService } from '../service/rating.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

@Component({
  selector: 'jhi-rating-update',
  templateUrl: './rating-update.component.html',
})
export class RatingUpdateComponent implements OnInit {
  isSaving = false;
  rating: IRating | null = null;

  usersSharedCollection: IUser[] = [];
  outfitsSharedCollection: IOutfit[] = [];

  editForm: RatingFormGroup = this.ratingFormService.createRatingFormGroup();

  constructor(
    protected ratingService: RatingService,
    protected ratingFormService: RatingFormService,
    protected userService: UserService,
    protected outfitService: OutfitService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareOutfit = (o1: IOutfit | null, o2: IOutfit | null): boolean => this.outfitService.compareOutfit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rating }) => {
      this.rating = rating;
      if (rating) {
        this.updateForm(rating);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rating = this.ratingFormService.getRating(this.editForm);
    if (rating.id !== null) {
      this.subscribeToSaveResponse(this.ratingService.update(rating));
    } else {
      this.subscribeToSaveResponse(this.ratingService.create(rating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRating>>): void {
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

  protected updateForm(rating: IRating): void {
    this.rating = rating;
    this.ratingFormService.resetForm(this.editForm, rating);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, rating.userRated);
    this.outfitsSharedCollection = this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(this.outfitsSharedCollection, rating.outfit);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.rating?.userRated)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.outfitService
      .query()
      .pipe(map((res: HttpResponse<IOutfit[]>) => res.body ?? []))
      .pipe(map((outfits: IOutfit[]) => this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(outfits, this.rating?.outfit)))
      .subscribe((outfits: IOutfit[]) => (this.outfitsSharedCollection = outfits));
  }
}
