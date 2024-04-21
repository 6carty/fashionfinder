import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExchangeRequestFormService } from './exchange-request-form.service';
import { ExchangeRequestService } from '../service/exchange-request.service';
import { IExchangeRequest } from '../exchange-request.model';
import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { ClothingItemService } from 'app/entities/clothing-item/service/clothing-item.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { ExchangeRequestUpdateComponent } from './exchange-request-update.component';

describe('ExchangeRequest Management Update Component', () => {
  let comp: ExchangeRequestUpdateComponent;
  let fixture: ComponentFixture<ExchangeRequestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exchangeRequestFormService: ExchangeRequestFormService;
  let exchangeRequestService: ExchangeRequestService;
  let clothingItemService: ClothingItemService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExchangeRequestUpdateComponent],
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
      .overrideTemplate(ExchangeRequestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExchangeRequestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exchangeRequestFormService = TestBed.inject(ExchangeRequestFormService);
    exchangeRequestService = TestBed.inject(ExchangeRequestService);
    clothingItemService = TestBed.inject(ClothingItemService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ClothingItem query and add missing value', () => {
      const exchangeRequest: IExchangeRequest = { id: 456 };
      const clothingItem: IClothingItem = { id: 85687 };
      exchangeRequest.clothingItem = clothingItem;

      const clothingItemCollection: IClothingItem[] = [{ id: 85330 }];
      jest.spyOn(clothingItemService, 'query').mockReturnValue(of(new HttpResponse({ body: clothingItemCollection })));
      const additionalClothingItems = [clothingItem];
      const expectedCollection: IClothingItem[] = [...additionalClothingItems, ...clothingItemCollection];
      jest.spyOn(clothingItemService, 'addClothingItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exchangeRequest });
      comp.ngOnInit();

      expect(clothingItemService.query).toHaveBeenCalled();
      expect(clothingItemService.addClothingItemToCollectionIfMissing).toHaveBeenCalledWith(
        clothingItemCollection,
        ...additionalClothingItems.map(expect.objectContaining)
      );
      expect(comp.clothingItemsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const exchangeRequest: IExchangeRequest = { id: 456 };
      const creater: IUserProfile = { id: 64855 };
      exchangeRequest.creater = creater;
      const requester: IUserProfile = { id: 25650 };
      exchangeRequest.requester = requester;

      const userProfileCollection: IUserProfile[] = [{ id: 2537 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [creater, requester];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exchangeRequest });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const exchangeRequest: IExchangeRequest = { id: 456 };
      const clothingItem: IClothingItem = { id: 13560 };
      exchangeRequest.clothingItem = clothingItem;
      const creater: IUserProfile = { id: 22043 };
      exchangeRequest.creater = creater;
      const requester: IUserProfile = { id: 23159 };
      exchangeRequest.requester = requester;

      activatedRoute.data = of({ exchangeRequest });
      comp.ngOnInit();

      expect(comp.clothingItemsSharedCollection).toContain(clothingItem);
      expect(comp.userProfilesSharedCollection).toContain(creater);
      expect(comp.userProfilesSharedCollection).toContain(requester);
      expect(comp.exchangeRequest).toEqual(exchangeRequest);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExchangeRequest>>();
      const exchangeRequest = { id: 123 };
      jest.spyOn(exchangeRequestFormService, 'getExchangeRequest').mockReturnValue(exchangeRequest);
      jest.spyOn(exchangeRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exchangeRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exchangeRequest }));
      saveSubject.complete();

      // THEN
      expect(exchangeRequestFormService.getExchangeRequest).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(exchangeRequestService.update).toHaveBeenCalledWith(expect.objectContaining(exchangeRequest));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExchangeRequest>>();
      const exchangeRequest = { id: 123 };
      jest.spyOn(exchangeRequestFormService, 'getExchangeRequest').mockReturnValue({ id: null });
      jest.spyOn(exchangeRequestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exchangeRequest: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exchangeRequest }));
      saveSubject.complete();

      // THEN
      expect(exchangeRequestFormService.getExchangeRequest).toHaveBeenCalled();
      expect(exchangeRequestService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExchangeRequest>>();
      const exchangeRequest = { id: 123 };
      jest.spyOn(exchangeRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exchangeRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exchangeRequestService.update).toHaveBeenCalled();
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
