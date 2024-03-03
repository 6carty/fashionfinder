import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserMilestoneFormService } from './user-milestone-form.service';
import { UserMilestoneService } from '../service/user-milestone.service';
import { IUserMilestone } from '../user-milestone.model';
import { IMilestoneType } from 'app/entities/milestone-type/milestone-type.model';
import { MilestoneTypeService } from 'app/entities/milestone-type/service/milestone-type.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { UserMilestoneUpdateComponent } from './user-milestone-update.component';

describe('UserMilestone Management Update Component', () => {
  let comp: UserMilestoneUpdateComponent;
  let fixture: ComponentFixture<UserMilestoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userMilestoneFormService: UserMilestoneFormService;
  let userMilestoneService: UserMilestoneService;
  let milestoneTypeService: MilestoneTypeService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserMilestoneUpdateComponent],
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
      .overrideTemplate(UserMilestoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserMilestoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userMilestoneFormService = TestBed.inject(UserMilestoneFormService);
    userMilestoneService = TestBed.inject(UserMilestoneService);
    milestoneTypeService = TestBed.inject(MilestoneTypeService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call MilestoneType query and add missing value', () => {
      const userMilestone: IUserMilestone = { id: 456 };
      const milestoneType: IMilestoneType = { id: 5440 };
      userMilestone.milestoneType = milestoneType;

      const milestoneTypeCollection: IMilestoneType[] = [{ id: 30970 }];
      jest.spyOn(milestoneTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: milestoneTypeCollection })));
      const additionalMilestoneTypes = [milestoneType];
      const expectedCollection: IMilestoneType[] = [...additionalMilestoneTypes, ...milestoneTypeCollection];
      jest.spyOn(milestoneTypeService, 'addMilestoneTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userMilestone });
      comp.ngOnInit();

      expect(milestoneTypeService.query).toHaveBeenCalled();
      expect(milestoneTypeService.addMilestoneTypeToCollectionIfMissing).toHaveBeenCalledWith(
        milestoneTypeCollection,
        ...additionalMilestoneTypes.map(expect.objectContaining)
      );
      expect(comp.milestoneTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const userMilestone: IUserMilestone = { id: 456 };
      const userProfile: IUserProfile = { id: 8118 };
      userMilestone.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 88125 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userMilestone });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userMilestone: IUserMilestone = { id: 456 };
      const milestoneType: IMilestoneType = { id: 37816 };
      userMilestone.milestoneType = milestoneType;
      const userProfile: IUserProfile = { id: 26446 };
      userMilestone.userProfile = userProfile;

      activatedRoute.data = of({ userMilestone });
      comp.ngOnInit();

      expect(comp.milestoneTypesSharedCollection).toContain(milestoneType);
      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.userMilestone).toEqual(userMilestone);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserMilestone>>();
      const userMilestone = { id: 123 };
      jest.spyOn(userMilestoneFormService, 'getUserMilestone').mockReturnValue(userMilestone);
      jest.spyOn(userMilestoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userMilestone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userMilestone }));
      saveSubject.complete();

      // THEN
      expect(userMilestoneFormService.getUserMilestone).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userMilestoneService.update).toHaveBeenCalledWith(expect.objectContaining(userMilestone));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserMilestone>>();
      const userMilestone = { id: 123 };
      jest.spyOn(userMilestoneFormService, 'getUserMilestone').mockReturnValue({ id: null });
      jest.spyOn(userMilestoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userMilestone: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userMilestone }));
      saveSubject.complete();

      // THEN
      expect(userMilestoneFormService.getUserMilestone).toHaveBeenCalled();
      expect(userMilestoneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserMilestone>>();
      const userMilestone = { id: 123 };
      jest.spyOn(userMilestoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userMilestone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userMilestoneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMilestoneType', () => {
      it('Should forward to milestoneTypeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(milestoneTypeService, 'compareMilestoneType');
        comp.compareMilestoneType(entity, entity2);
        expect(milestoneTypeService.compareMilestoneType).toHaveBeenCalledWith(entity, entity2);
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
