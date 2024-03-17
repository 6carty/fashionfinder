import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OutfitFormService, OutfitFormGroup } from './outfit-form.service';
import { IOutfit } from '../outfit.model';
import { OutfitService } from '../service/outfit.service';
import { IWeather } from 'app/entities/weather/weather.model';
import { WeatherService } from 'app/entities/weather/service/weather.service';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
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

  weathersSharedCollection: IWeather[] = [];
  ratingsSharedCollection: IRating[] = [];
  eventsSharedCollection: IEvent[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: OutfitFormGroup = this.outfitFormService.createOutfitFormGroup();

  constructor(
    protected outfitService: OutfitService,
    protected outfitFormService: OutfitFormService,
    protected weatherService: WeatherService,
    protected ratingService: RatingService,
    protected eventService: EventService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareWeather = (o1: IWeather | null, o2: IWeather | null): boolean => this.weatherService.compareWeather(o1, o2);

  compareRating = (o1: IRating | null, o2: IRating | null): boolean => this.ratingService.compareRating(o1, o2);

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

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

    this.weathersSharedCollection = this.weatherService.addWeatherToCollectionIfMissing<IWeather>(
      this.weathersSharedCollection,
      outfit.weather
    );
    this.ratingsSharedCollection = this.ratingService.addRatingToCollectionIfMissing<IRating>(this.ratingsSharedCollection, outfit.rating);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing<IEvent>(this.eventsSharedCollection, outfit.event);
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      outfit.creator
    );
  }

  protected loadRelationshipsOptions(): void {
    this.weatherService
      .query()
      .pipe(map((res: HttpResponse<IWeather[]>) => res.body ?? []))
      .pipe(map((weathers: IWeather[]) => this.weatherService.addWeatherToCollectionIfMissing<IWeather>(weathers, this.outfit?.weather)))
      .subscribe((weathers: IWeather[]) => (this.weathersSharedCollection = weathers));

    this.ratingService
      .query()
      .pipe(map((res: HttpResponse<IRating[]>) => res.body ?? []))
      .pipe(map((ratings: IRating[]) => this.ratingService.addRatingToCollectionIfMissing<IRating>(ratings, this.outfit?.rating)))
      .subscribe((ratings: IRating[]) => (this.ratingsSharedCollection = ratings));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing<IEvent>(events, this.outfit?.event)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

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
