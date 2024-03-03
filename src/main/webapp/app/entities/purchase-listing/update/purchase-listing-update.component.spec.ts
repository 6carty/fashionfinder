import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PurchaseListingFormService } from './purchase-listing-form.service';
import { PurchaseListingService } from '../service/purchase-listing.service';
import { IPurchaseListing } from '../purchase-listing.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { PurchaseListingUpdateComponent } from './purchase-listing-update.component';

describe('PurchaseListing Management Update Component', () => {
  let comp: PurchaseListingUpdateComponent;
  let fixture: ComponentFixture<PurchaseListingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let purchaseListingFormService: PurchaseListingFormService;
  let purchaseListingService: PurchaseListingService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PurchaseListingUpdateComponent],
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
      .overrideTemplate(PurchaseListingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseListingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    purchaseListingFormService = TestBed.inject(PurchaseListingFormService);
    purchaseListingService = TestBed.inject(PurchaseListingService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const purchaseListing: IPurchaseListing = { id: 456 };
      const seller: IUserProfile = { id: 99259 };
      purchaseListing.seller = seller;

      const userProfileCollection: IUserProfile[] = [{ id: 16128 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [seller];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseListing });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const purchaseListing: IPurchaseListing = { id: 456 };
      const seller: IUserProfile = { id: 22905 };
      purchaseListing.seller = seller;

      activatedRoute.data = of({ purchaseListing });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(seller);
      expect(comp.purchaseListing).toEqual(purchaseListing);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseListing>>();
      const purchaseListing = { id: 123 };
      jest.spyOn(purchaseListingFormService, 'getPurchaseListing').mockReturnValue(purchaseListing);
      jest.spyOn(purchaseListingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseListing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseListing }));
      saveSubject.complete();

      // THEN
      expect(purchaseListingFormService.getPurchaseListing).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(purchaseListingService.update).toHaveBeenCalledWith(expect.objectContaining(purchaseListing));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseListing>>();
      const purchaseListing = { id: 123 };
      jest.spyOn(purchaseListingFormService, 'getPurchaseListing').mockReturnValue({ id: null });
      jest.spyOn(purchaseListingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseListing: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseListing }));
      saveSubject.complete();

      // THEN
      expect(purchaseListingFormService.getPurchaseListing).toHaveBeenCalled();
      expect(purchaseListingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseListing>>();
      const purchaseListing = { id: 123 };
      jest.spyOn(purchaseListingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseListing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(purchaseListingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
