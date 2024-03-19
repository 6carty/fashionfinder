import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OutfitPicFormService } from './outfit-pic-form.service';
import { OutfitPicService } from '../service/outfit-pic.service';
import { IOutfitPic } from '../outfit-pic.model';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

import { OutfitPicUpdateComponent } from './outfit-pic-update.component';

describe('OutfitPic Management Update Component', () => {
  let comp: OutfitPicUpdateComponent;
  let fixture: ComponentFixture<OutfitPicUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let outfitPicFormService: OutfitPicFormService;
  let outfitPicService: OutfitPicService;
  let outfitService: OutfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OutfitPicUpdateComponent],
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
      .overrideTemplate(OutfitPicUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OutfitPicUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    outfitPicFormService = TestBed.inject(OutfitPicFormService);
    outfitPicService = TestBed.inject(OutfitPicService);
    outfitService = TestBed.inject(OutfitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Outfit query and add missing value', () => {
      const outfitPic: IOutfitPic = { id: 456 };
      const outfit: IOutfit = { id: 6865 };
      outfitPic.outfit = outfit;

      const outfitCollection: IOutfit[] = [{ id: 18185 }];
      jest.spyOn(outfitService, 'query').mockReturnValue(of(new HttpResponse({ body: outfitCollection })));
      const additionalOutfits = [outfit];
      const expectedCollection: IOutfit[] = [...additionalOutfits, ...outfitCollection];
      jest.spyOn(outfitService, 'addOutfitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ outfitPic });
      comp.ngOnInit();

      expect(outfitService.query).toHaveBeenCalled();
      expect(outfitService.addOutfitToCollectionIfMissing).toHaveBeenCalledWith(
        outfitCollection,
        ...additionalOutfits.map(expect.objectContaining)
      );
      expect(comp.outfitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const outfitPic: IOutfitPic = { id: 456 };
      const outfit: IOutfit = { id: 75053 };
      outfitPic.outfit = outfit;

      activatedRoute.data = of({ outfitPic });
      comp.ngOnInit();

      expect(comp.outfitsSharedCollection).toContain(outfit);
      expect(comp.outfitPic).toEqual(outfitPic);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOutfitPic>>();
      const outfitPic = { id: 123 };
      jest.spyOn(outfitPicFormService, 'getOutfitPic').mockReturnValue(outfitPic);
      jest.spyOn(outfitPicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outfitPic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: outfitPic }));
      saveSubject.complete();

      // THEN
      expect(outfitPicFormService.getOutfitPic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(outfitPicService.update).toHaveBeenCalledWith(expect.objectContaining(outfitPic));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOutfitPic>>();
      const outfitPic = { id: 123 };
      jest.spyOn(outfitPicFormService, 'getOutfitPic').mockReturnValue({ id: null });
      jest.spyOn(outfitPicService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outfitPic: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: outfitPic }));
      saveSubject.complete();

      // THEN
      expect(outfitPicFormService.getOutfitPic).toHaveBeenCalled();
      expect(outfitPicService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOutfitPic>>();
      const outfitPic = { id: 123 };
      jest.spyOn(outfitPicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ outfitPic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(outfitPicService.update).toHaveBeenCalled();
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
