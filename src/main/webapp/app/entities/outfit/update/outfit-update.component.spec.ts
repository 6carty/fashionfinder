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
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { OutfitUpdateComponent } from './outfit-update.component';

describe('Outfit Management Update Component', () => {
  let comp: OutfitUpdateComponent;
  let fixture: ComponentFixture<OutfitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let outfitFormService: OutfitFormService;
  let outfitService: OutfitService;
  let ratingService: RatingService;
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
    ratingService = TestBed.inject(RatingService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call rating query and add missing value', () => {
      const outfit: IOutfit = { id: 456 };
      const rating: IRating = { id: 76865 };
      outfit.rating = rating;

      const ratingCollection: IRating[] = [{ id: 39298 }];
      jest.spyOn(ratingService, 'query').mockReturnValue(of(new HttpResponse({ body: ratingCollection })));
      const expectedCollection: IRating[] = [rating, ...ratingCollection];
      jest.spyOn(ratingService, 'addRatingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      expect(ratingService.query).toHaveBeenCalled();
      expect(ratingService.addRatingToCollectionIfMissing).toHaveBeenCalledWith(ratingCollection, rating);
      expect(comp.ratingsCollection).toEqual(expectedCollection);
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
      const rating: IRating = { id: 71358 };
      outfit.rating = rating;
      const creator: IUserProfile = { id: 80256 };
      outfit.creator = creator;

      activatedRoute.data = of({ outfit });
      comp.ngOnInit();

      expect(comp.ratingsCollection).toContain(rating);
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
    describe('compareRating', () => {
      it('Should forward to ratingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ratingService, 'compareRating');
        comp.compareRating(entity, entity2);
        expect(ratingService.compareRating).toHaveBeenCalledWith(entity, entity2);
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
