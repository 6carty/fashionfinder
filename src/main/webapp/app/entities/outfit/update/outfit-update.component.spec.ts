import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OutfitFormService } from './outfit-form.service';
import { OutfitService } from '../service/outfit.service';
import { IOutfit } from '../outfit.model';
import { IWeather } from 'app/entities/weather/weather.model';
import { WeatherService } from 'app/entities/weather/service/weather.service';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { OutfitUpdateComponent } from './outfit-update.component';

describe('Outfit Management Update Component', () => {
  let comp: OutfitUpdateComponent;
  let fixture: ComponentFixture<OutfitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let outfitFormService: OutfitFormService;
  let outfitService: OutfitService;
  let weatherService: WeatherService;
  let ratingService: RatingService;
  let eventService: EventService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OutfitUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OutfitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OutfitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    outfitFormService = TestBed.inject(OutfitFormService);
    outfitService = TestBed.inject(OutfitService);
    weatherService = TestBed.inject(WeatherService);
    ratingService = TestBed.inject(RatingService);
    eventService = TestBed.inject(EventService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Weather query and add missing value', () => {
      const outfit: IOutfit = { id: 456 };
      const weather: IWeather = { id: 52454 };
      outfit.weather = weather;

      const weatherCollection: IWeather[] = [{ id: 48526 }];
      jest.spyOn(weatherService, 'query').mockReturnValue(of(new HttpResponse({ body: weatherCollection })));
      const additionalWeathers = [weather];
      const expectedCollection: IWeather[] = [...additionalWeathers, ...weatherCollection];
      jest.spyOn(weatherService, 'addWeatherToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      expect(weatherService.query).toHaveBeenCalled();
      expect(weatherService.addWeatherToCollectionIfMissing).toHaveBeenCalledWith(
        weatherCollection,
        ...additionalWeathers.map(expect.objectContaining)
      );
      expect(comp.weathersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Rating query and add missing value', () => {
      const outfit: IOutfit = { id: 456 };
      const rating: IRating = { id: 76865 };
      outfit.rating = rating;

      const ratingCollection: IRating[] = [{ id: 39298 }];
      jest.spyOn(ratingService, 'query').mockReturnValue(of(new HttpResponse({ body: ratingCollection })));
      const additionalRatings = [rating];
      const expectedCollection: IRating[] = [...additionalRatings, ...ratingCollection];
      jest.spyOn(ratingService, 'addRatingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      expect(ratingService.query).toHaveBeenCalled();
      expect(ratingService.addRatingToCollectionIfMissing).toHaveBeenCalledWith(
        ratingCollection,
        ...additionalRatings.map(expect.objectContaining)
      );
      expect(comp.ratingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const outfit: IOutfit = { id: 456 };
      const event: IEvent = { id: 53313 };
      outfit.event = event;

      const eventCollection: IEvent[] = [{ id: 91553 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(
        eventCollection,
        ...additionalEvents.map(expect.objectContaining)
      );
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const outfit: IOutfit = { id: 456 };
      const creator: IUserProfile = { id: 86561 };
      outfit.creator = creator;

      const userProfileCollection: IUserProfile[] = [{ id: 13732 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [creator];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const outfit: IOutfit = { id: 456 };
      const weather: IWeather = { id: 83363 };
      outfit.weather = weather;
      const rating: IRating = { id: 71358 };
      outfit.rating = rating;
      const event: IEvent = { id: 36543 };
      outfit.event = event;
      const creator: IUserProfile = { id: 80256 };
      outfit.creator = creator;

      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      expect(comp.weathersSharedCollection).toContain(weather);
      expect(comp.ratingsSharedCollection).toContain(rating);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.userProfilesSharedCollection).toContain(creator);
      expect(comp.outfit).toEqual(outfit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOutfit>>();
      const outfit = { id: 123 };
      jest.spyOn(outfitFormService, 'getOutfit').mockReturnValue(outfit);
      jest.spyOn(outfitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: outfit }));
      saveSubject.complete();

      // THEN
      expect(outfitFormService.getOutfit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(outfitService.update).toHaveBeenCalledWith(expect.objectContaining(outfit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOutfit>>();
      const outfit = { id: 123 };
      jest.spyOn(outfitFormService, 'getOutfit').mockReturnValue({ id: null });
      jest.spyOn(outfitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outfit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: outfit }));
      saveSubject.complete();

      // THEN
      expect(outfitFormService.getOutfit).toHaveBeenCalled();
      expect(outfitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOutfit>>();
      const outfit = { id: 123 };
      jest.spyOn(outfitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(outfitService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareWeather', () => {
      it('Should forward to weatherService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(weatherService, 'compareWeather');
        comp.compareWeather(entity, entity2);
        expect(weatherService.compareWeather).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRating', () => {
      it('Should forward to ratingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ratingService, 'compareRating');
        comp.compareRating(entity, entity2);
        expect(ratingService.compareRating).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEvent', () => {
      it('Should forward to eventService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventService, 'compareEvent');
        comp.compareEvent(entity, entity2);
        expect(eventService.compareEvent).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
