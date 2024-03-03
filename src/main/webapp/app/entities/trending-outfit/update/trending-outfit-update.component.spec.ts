import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TrendingOutfitFormService } from './trending-outfit-form.service';
import { TrendingOutfitService } from '../service/trending-outfit.service';
import { ITrendingOutfit } from '../trending-outfit.model';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';

import { TrendingOutfitUpdateComponent } from './trending-outfit-update.component';

describe('TrendingOutfit Management Update Component', () => {
  let comp: TrendingOutfitUpdateComponent;
  let fixture: ComponentFixture<TrendingOutfitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let trendingOutfitFormService: TrendingOutfitFormService;
  let trendingOutfitService: TrendingOutfitService;
  let ratingService: RatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TrendingOutfitUpdateComponent],
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
      .overrideTemplate(TrendingOutfitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrendingOutfitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    trendingOutfitFormService = TestBed.inject(TrendingOutfitFormService);
    trendingOutfitService = TestBed.inject(TrendingOutfitService);
    ratingService = TestBed.inject(RatingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call rating query and add missing value', () => {
      const trendingOutfit: ITrendingOutfit = { id: 456 };
      const rating: IRating = { id: 4256 };
      trendingOutfit.rating = rating;

      const ratingCollection: IRating[] = [{ id: 63198 }];
      jest.spyOn(ratingService, 'query').mockReturnValue(of(new HttpResponse({ body: ratingCollection })));
      const expectedCollection: IRating[] = [rating, ...ratingCollection];
      jest.spyOn(ratingService, 'addRatingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ trendingOutfit });
      comp.ngOnInit();

      expect(ratingService.query).toHaveBeenCalled();
      expect(ratingService.addRatingToCollectionIfMissing).toHaveBeenCalledWith(ratingCollection, rating);
      expect(comp.ratingsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const trendingOutfit: ITrendingOutfit = { id: 456 };
      const rating: IRating = { id: 40168 };
      trendingOutfit.rating = rating;

      activatedRoute.data = of({ trendingOutfit });
      comp.ngOnInit();

      expect(comp.ratingsCollection).toContain(rating);
      expect(comp.trendingOutfit).toEqual(trendingOutfit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrendingOutfit>>();
      const trendingOutfit = { id: 123 };
      jest.spyOn(trendingOutfitFormService, 'getTrendingOutfit').mockReturnValue(trendingOutfit);
      jest.spyOn(trendingOutfitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trendingOutfit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trendingOutfit }));
      saveSubject.complete();

      // THEN
      expect(trendingOutfitFormService.getTrendingOutfit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(trendingOutfitService.update).toHaveBeenCalledWith(expect.objectContaining(trendingOutfit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrendingOutfit>>();
      const trendingOutfit = { id: 123 };
      jest.spyOn(trendingOutfitFormService, 'getTrendingOutfit').mockReturnValue({ id: null });
      jest.spyOn(trendingOutfitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trendingOutfit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trendingOutfit }));
      saveSubject.complete();

      // THEN
      expect(trendingOutfitFormService.getTrendingOutfit).toHaveBeenCalled();
      expect(trendingOutfitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrendingOutfit>>();
      const trendingOutfit = { id: 123 };
      jest.spyOn(trendingOutfitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trendingOutfit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(trendingOutfitService.update).toHaveBeenCalled();
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
  });
});
