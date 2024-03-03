import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FashionTipFormService } from './fashion-tip-form.service';
import { FashionTipService } from '../service/fashion-tip.service';
import { IFashionTip } from '../fashion-tip.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { FashionTipUpdateComponent } from './fashion-tip-update.component';

describe('FashionTip Management Update Component', () => {
  let comp: FashionTipUpdateComponent;
  let fixture: ComponentFixture<FashionTipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fashionTipFormService: FashionTipFormService;
  let fashionTipService: FashionTipService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FashionTipUpdateComponent],
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
      .overrideTemplate(FashionTipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FashionTipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fashionTipFormService = TestBed.inject(FashionTipFormService);
    fashionTipService = TestBed.inject(FashionTipService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const fashionTip: IFashionTip = { id: 456 };
      const author: IUserProfile = { id: 71519 };
      fashionTip.author = author;

      const userProfileCollection: IUserProfile[] = [{ id: 21055 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [author];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fashionTip });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fashionTip: IFashionTip = { id: 456 };
      const author: IUserProfile = { id: 89495 };
      fashionTip.author = author;

      activatedRoute.data = of({ fashionTip });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(author);
      expect(comp.fashionTip).toEqual(fashionTip);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFashionTip>>();
      const fashionTip = { id: 123 };
      jest.spyOn(fashionTipFormService, 'getFashionTip').mockReturnValue(fashionTip);
      jest.spyOn(fashionTipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fashionTip });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fashionTip }));
      saveSubject.complete();

      // THEN
      expect(fashionTipFormService.getFashionTip).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fashionTipService.update).toHaveBeenCalledWith(expect.objectContaining(fashionTip));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFashionTip>>();
      const fashionTip = { id: 123 };
      jest.spyOn(fashionTipFormService, 'getFashionTip').mockReturnValue({ id: null });
      jest.spyOn(fashionTipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fashionTip: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fashionTip }));
      saveSubject.complete();

      // THEN
      expect(fashionTipFormService.getFashionTip).toHaveBeenCalled();
      expect(fashionTipService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFashionTip>>();
      const fashionTip = { id: 123 };
      jest.spyOn(fashionTipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fashionTip });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fashionTipService.update).toHaveBeenCalled();
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
