import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RatingFormService } from './rating-form.service';
import { RatingService } from '../service/rating.service';
import { IRating } from '../rating.model';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

import { RatingUpdateComponent } from './rating-update.component';

describe('Rating Management Update Component', () => {
  let comp: RatingUpdateComponent;
  let fixture: ComponentFixture<RatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ratingFormService: RatingFormService;
  let ratingService: RatingService;
  let outfitService: OutfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RatingUpdateComponent],
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
      .overrideTemplate(RatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ratingFormService = TestBed.inject(RatingFormService);
    ratingService = TestBed.inject(RatingService);
    outfitService = TestBed.inject(OutfitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Outfit query and add missing value', () => {
      const rating: IRating = { id: 456 };
      const outfit: IOutfit = { id: 29956 };
      rating.outfit = outfit;

      const outfitCollection: IOutfit[] = [{ id: 88356 }];
      jest.spyOn(outfitService, 'query').mockReturnValue(of(new HttpResponse({ body: outfitCollection })));
      const additionalOutfits = [outfit];
      const expectedCollection: IOutfit[] = [...additionalOutfits, ...outfitCollection];
      jest.spyOn(outfitService, 'addOutfitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(outfitService.query).toHaveBeenCalled();
      expect(outfitService.addOutfitToCollectionIfMissing).toHaveBeenCalledWith(
        outfitCollection,
        ...additionalOutfits.map(expect.objectContaining)
      );
      expect(comp.outfitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const rating: IRating = { id: 456 };
      const outfit: IOutfit = { id: 28331 };
      rating.outfit = outfit;

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(comp.outfitsSharedCollection).toContain(outfit);
      expect(comp.rating).toEqual(rating);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingFormService, 'getRating').mockReturnValue(rating);
      jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rating }));
      saveSubject.complete();

      // THEN
      expect(ratingFormService.getRating).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ratingService.update).toHaveBeenCalledWith(expect.objectContaining(rating));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingFormService, 'getRating').mockReturnValue({ id: null });
      jest.spyOn(ratingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rating }));
      saveSubject.complete();

      // THEN
      expect(ratingFormService.getRating).toHaveBeenCalled();
      expect(ratingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ratingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOutfit', () => {
      it('Should forward to outfitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(outfitService, 'compareOutfit');
        comp.compareOutfit(entity, entity2);
        expect(outfitService.compareOutfit).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
