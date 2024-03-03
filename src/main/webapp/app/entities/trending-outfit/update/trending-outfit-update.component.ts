import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TrendingOutfitFormService, TrendingOutfitFormGroup } from './trending-outfit-form.service';
import { ITrendingOutfit } from '../trending-outfit.model';
import { TrendingOutfitService } from '../service/trending-outfit.service';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';

@Component({
  selector: 'jhi-trending-outfit-update',
  templateUrl: './trending-outfit-update.component.html',
})
export class TrendingOutfitUpdateComponent implements OnInit {
  isSaving = false;
  trendingOutfit: ITrendingOutfit | null = null;

  ratingsCollection: IRating[] = [];

  editForm: TrendingOutfitFormGroup = this.trendingOutfitFormService.createTrendingOutfitFormGroup();

  constructor(
    protected trendingOutfitService: TrendingOutfitService,
    protected trendingOutfitFormService: TrendingOutfitFormService,
    protected ratingService: RatingService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRating = (o1: IRating | null, o2: IRating | null): boolean => this.ratingService.compareRating(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trendingOutfit }) => {
      this.trendingOutfit = trendingOutfit;
      if (trendingOutfit) {
        this.updateForm(trendingOutfit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trendingOutfit = this.trendingOutfitFormService.getTrendingOutfit(this.editForm);
    if (trendingOutfit.id !== null) {
      this.subscribeToSaveResponse(this.trendingOutfitService.update(trendingOutfit));
    } else {
      this.subscribeToSaveResponse(this.trendingOutfitService.create(trendingOutfit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrendingOutfit>>): void {
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

  protected updateForm(trendingOutfit: ITrendingOutfit): void {
    this.trendingOutfit = trendingOutfit;
    this.trendingOutfitFormService.resetForm(this.editForm, trendingOutfit);

    this.ratingsCollection = this.ratingService.addRatingToCollectionIfMissing<IRating>(this.ratingsCollection, trendingOutfit.rating);
  }

  protected loadRelationshipsOptions(): void {
    this.ratingService
      .query({ filter: 'trendingoutfit-is-null' })
      .pipe(map((res: HttpResponse<IRating[]>) => res.body ?? []))
      .pipe(map((ratings: IRating[]) => this.ratingService.addRatingToCollectionIfMissing<IRating>(ratings, this.trendingOutfit?.rating)))
      .subscribe((ratings: IRating[]) => (this.ratingsCollection = ratings));
  }
}
