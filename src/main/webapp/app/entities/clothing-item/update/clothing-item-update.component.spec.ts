import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClothingItemFormService } from './clothing-item-form.service';
import { ClothingItemService } from '../service/clothing-item.service';
import { IClothingItem } from '../clothing-item.model';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { ClothingItemUpdateComponent } from './clothing-item-update.component';

describe('ClothingItem Management Update Component', () => {
  let comp: ClothingItemUpdateComponent;
  let fixture: ComponentFixture<ClothingItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clothingItemFormService: ClothingItemFormService;
  let clothingItemService: ClothingItemService;
  let eventService: EventService;
  let outfitService: OutfitService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClothingItemUpdateComponent],
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
      .overrideTemplate(ClothingItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClothingItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clothingItemFormService = TestBed.inject(ClothingItemFormService);
    clothingItemService = TestBed.inject(ClothingItemService);
    eventService = TestBed.inject(EventService);
    outfitService = TestBed.inject(OutfitService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Event query and add missing value', () => {
      const clothingItem: IClothingItem = { id: 456 };
      const event: IEvent = { id: 15890 };
      clothingItem.event = event;

      const eventCollection: IEvent[] = [{ id: 37376 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clothingItem });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(
        eventCollection,
        ...additionalEvents.map(expect.objectContaining)
      );
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Outfit query and add missing value', () => {
      const clothingItem: IClothingItem = { id: 456 };
      const outfits: IOutfit[] = [{ id: 10311 }];
      clothingItem.outfits = outfits;

      const outfitCollection: IOutfit[] = [{ id: 17293 }];
      jest.spyOn(outfitService, 'query').mockReturnValue(of(new HttpResponse({ body: outfitCollection })));
      const additionalOutfits = [...outfits];
      const expectedCollection: IOutfit[] = [...additionalOutfits, ...outfitCollection];
      jest.spyOn(outfitService, 'addOutfitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clothingItem });
      comp.ngOnInit();

      expect(outfitService.query).toHaveBeenCalled();
      expect(outfitService.addOutfitToCollectionIfMissing).toHaveBeenCalledWith(
        outfitCollection,
        ...additionalOutfits.map(expect.objectContaining)
      );
      expect(comp.outfitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const clothingItem: IClothingItem = { id: 456 };
      const owner: IUserProfile = { id: 68353 };
      clothingItem.owner = owner;

      const userProfileCollection: IUserProfile[] = [{ id: 34446 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [owner];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clothingItem });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const clothingItem: IClothingItem = { id: 456 };
      const event: IEvent = { id: 61353 };
      clothingItem.event = event;
      const outfit: IOutfit = { id: 87868 };
      clothingItem.outfits = [outfit];
      const owner: IUserProfile = { id: 21800 };
      clothingItem.owner = owner;

      activatedRoute.data = of({ clothingItem });
      comp.ngOnInit();

      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.outfitsSharedCollection).toContain(outfit);
      expect(comp.userProfilesSharedCollection).toContain(owner);
      expect(comp.clothingItem).toEqual(clothingItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothingItem>>();
      const clothingItem = { id: 123 };
      jest.spyOn(clothingItemFormService, 'getClothingItem').mockReturnValue(clothingItem);
      jest.spyOn(clothingItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothingItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clothingItem }));
      saveSubject.complete();

      // THEN
      expect(clothingItemFormService.getClothingItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clothingItemService.update).toHaveBeenCalledWith(expect.objectContaining(clothingItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothingItem>>();
      const clothingItem = { id: 123 };
      jest.spyOn(clothingItemFormService, 'getClothingItem').mockReturnValue({ id: null });
      jest.spyOn(clothingItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothingItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clothingItem }));
      saveSubject.complete();

      // THEN
      expect(clothingItemFormService.getClothingItem).toHaveBeenCalled();
      expect(clothingItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothingItem>>();
      const clothingItem = { id: 123 };
      jest.spyOn(clothingItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothingItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clothingItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEvent', () => {
      it('Should forward to eventService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventService, 'compareEvent');
        comp.compareEvent(entity, entity2);
        expect(eventService.compareEvent).toHaveBeenCalledWith(entity, entity2);
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
