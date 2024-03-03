import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SaleListingFormService } from './sale-listing-form.service';
import { SaleListingService } from '../service/sale-listing.service';
import { ISaleListing } from '../sale-listing.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { SaleListingUpdateComponent } from './sale-listing-update.component';

describe('SaleListing Management Update Component', () => {
  let comp: SaleListingUpdateComponent;
  let fixture: ComponentFixture<SaleListingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let saleListingFormService: SaleListingFormService;
  let saleListingService: SaleListingService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SaleListingUpdateComponent],
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
      .overrideTemplate(SaleListingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SaleListingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    saleListingFormService = TestBed.inject(SaleListingFormService);
    saleListingService = TestBed.inject(SaleListingService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const saleListing: ISaleListing = { id: 456 };
      const seller: IUserProfile = { id: 73094 };
      saleListing.seller = seller;

      const userProfileCollection: IUserProfile[] = [{ id: 32467 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [seller];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ saleListing });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const saleListing: ISaleListing = { id: 456 };
      const seller: IUserProfile = { id: 91538 };
      saleListing.seller = seller;

      activatedRoute.data = of({ saleListing });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(seller);
      expect(comp.saleListing).toEqual(saleListing);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISaleListing>>();
      const saleListing = { id: 123 };
      jest.spyOn(saleListingFormService, 'getSaleListing').mockReturnValue(saleListing);
      jest.spyOn(saleListingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saleListing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saleListing }));
      saveSubject.complete();

      // THEN
      expect(saleListingFormService.getSaleListing).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(saleListingService.update).toHaveBeenCalledWith(expect.objectContaining(saleListing));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISaleListing>>();
      const saleListing = { id: 123 };
      jest.spyOn(saleListingFormService, 'getSaleListing').mockReturnValue({ id: null });
      jest.spyOn(saleListingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saleListing: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saleListing }));
      saveSubject.complete();

      // THEN
      expect(saleListingFormService.getSaleListing).toHaveBeenCalled();
      expect(saleListingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISaleListing>>();
      const saleListing = { id: 123 };
      jest.spyOn(saleListingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saleListing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(saleListingService.update).toHaveBeenCalled();
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
