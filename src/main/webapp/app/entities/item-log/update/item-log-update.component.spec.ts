import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemLogFormService } from './item-log-form.service';
import { ItemLogService } from '../service/item-log.service';
import { IItemLog } from '../item-log.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

import { ItemLogUpdateComponent } from './item-log-update.component';

describe('ItemLog Management Update Component', () => {
  let comp: ItemLogUpdateComponent;
  let fixture: ComponentFixture<ItemLogUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemLogFormService: ItemLogFormService;
  let itemLogService: ItemLogService;
  let userService: UserService;
  let outfitService: OutfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemLogUpdateComponent],
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
      .overrideTemplate(ItemLogUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemLogUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemLogFormService = TestBed.inject(ItemLogFormService);
    itemLogService = TestBed.inject(ItemLogService);
    userService = TestBed.inject(UserService);
    outfitService = TestBed.inject(OutfitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const itemLog: IItemLog = { id: 456 };
      const owner: IUser = { id: 99827 };
      itemLog.owner = owner;

      const userCollection: IUser[] = [{ id: 42712 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [owner];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemLog });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Outfit query and add missing value', () => {
      const itemLog: IItemLog = { id: 456 };
      const outfit: IOutfit = { id: 18261 };
      itemLog.outfit = outfit;

      const outfitCollection: IOutfit[] = [{ id: 23543 }];
      jest.spyOn(outfitService, 'query').mockReturnValue(of(new HttpResponse({ body: outfitCollection })));
      const additionalOutfits = [outfit];
      const expectedCollection: IOutfit[] = [...additionalOutfits, ...outfitCollection];
      jest.spyOn(outfitService, 'addOutfitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemLog });
      comp.ngOnInit();

      expect(outfitService.query).toHaveBeenCalled();
      expect(outfitService.addOutfitToCollectionIfMissing).toHaveBeenCalledWith(
        outfitCollection,
        ...additionalOutfits.map(expect.objectContaining)
      );
      expect(comp.outfitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itemLog: IItemLog = { id: 456 };
      const owner: IUser = { id: 37916 };
      itemLog.owner = owner;
      const outfit: IOutfit = { id: 60812 };
      itemLog.outfit = outfit;

      activatedRoute.data = of({ itemLog });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(owner);
      expect(comp.outfitsSharedCollection).toContain(outfit);
      expect(comp.itemLog).toEqual(itemLog);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemLog>>();
      const itemLog = { id: 123 };
      jest.spyOn(itemLogFormService, 'getItemLog').mockReturnValue(itemLog);
      jest.spyOn(itemLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemLog }));
      saveSubject.complete();

      // THEN
      expect(itemLogFormService.getItemLog).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemLogService.update).toHaveBeenCalledWith(expect.objectContaining(itemLog));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemLog>>();
      const itemLog = { id: 123 };
      jest.spyOn(itemLogFormService, 'getItemLog').mockReturnValue({ id: null });
      jest.spyOn(itemLogService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemLog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemLog }));
      saveSubject.complete();

      // THEN
      expect(itemLogFormService.getItemLog).toHaveBeenCalled();
      expect(itemLogService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemLog>>();
      const itemLog = { id: 123 };
      jest.spyOn(itemLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemLogService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
