import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClothingPicFormService } from './clothing-pic-form.service';
import { ClothingPicService } from '../service/clothing-pic.service';
import { IClothingPic } from '../clothing-pic.model';
import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { ClothingItemService } from 'app/entities/clothing-item/service/clothing-item.service';

import { ClothingPicUpdateComponent } from './clothing-pic-update.component';

describe('ClothingPic Management Update Component', () => {
  let comp: ClothingPicUpdateComponent;
  let fixture: ComponentFixture<ClothingPicUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clothingPicFormService: ClothingPicFormService;
  let clothingPicService: ClothingPicService;
  let clothingItemService: ClothingItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClothingPicUpdateComponent],
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
      .overrideTemplate(ClothingPicUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClothingPicUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clothingPicFormService = TestBed.inject(ClothingPicFormService);
    clothingPicService = TestBed.inject(ClothingPicService);
    clothingItemService = TestBed.inject(ClothingItemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ClothingItem query and add missing value', () => {
      const clothingPic: IClothingPic = { id: 456 };
      const clothingItem: IClothingItem = { id: 36339 };
      clothingPic.clothingItem = clothingItem;

      const clothingItemCollection: IClothingItem[] = [{ id: 90999 }];
      jest.spyOn(clothingItemService, 'query').mockReturnValue(of(new HttpResponse({ body: clothingItemCollection })));
      const additionalClothingItems = [clothingItem];
      const expectedCollection: IClothingItem[] = [...additionalClothingItems, ...clothingItemCollection];
      jest.spyOn(clothingItemService, 'addClothingItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clothingPic });
      comp.ngOnInit();

      expect(clothingItemService.query).toHaveBeenCalled();
      expect(clothingItemService.addClothingItemToCollectionIfMissing).toHaveBeenCalledWith(
        clothingItemCollection,
        ...additionalClothingItems.map(expect.objectContaining)
      );
      expect(comp.clothingItemsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const clothingPic: IClothingPic = { id: 456 };
      const clothingItem: IClothingItem = { id: 56096 };
      clothingPic.clothingItem = clothingItem;

      activatedRoute.data = of({ clothingPic });
      comp.ngOnInit();

      expect(comp.clothingItemsSharedCollection).toContain(clothingItem);
      expect(comp.clothingPic).toEqual(clothingPic);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothingPic>>();
      const clothingPic = { id: 123 };
      jest.spyOn(clothingPicFormService, 'getClothingPic').mockReturnValue(clothingPic);
      jest.spyOn(clothingPicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothingPic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clothingPic }));
      saveSubject.complete();

      // THEN
      expect(clothingPicFormService.getClothingPic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clothingPicService.update).toHaveBeenCalledWith(expect.objectContaining(clothingPic));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothingPic>>();
      const clothingPic = { id: 123 };
      jest.spyOn(clothingPicFormService, 'getClothingPic').mockReturnValue({ id: null });
      jest.spyOn(clothingPicService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothingPic: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clothingPic }));
      saveSubject.complete();

      // THEN
      expect(clothingPicFormService.getClothingPic).toHaveBeenCalled();
      expect(clothingPicService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothingPic>>();
      const clothingPic = { id: 123 };
      jest.spyOn(clothingPicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothingPic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clothingPicService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClothingItem', () => {
      it('Should forward to clothingItemService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clothingItemService, 'compareClothingItem');
        comp.compareClothingItem(entity, entity2);
        expect(clothingItemService.compareClothingItem).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
