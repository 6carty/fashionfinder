import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-milestone.test-samples';

import { UserMilestoneFormService } from './user-milestone-form.service';

describe('UserMilestone Form Service', () => {
  let service: UserMilestoneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMilestoneFormService);
  });

  describe('Service methods', () => {
    describe('createUserMilestoneFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserMilestoneFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            currentProgress: expect.any(Object),
            completed: expect.any(Object),
            unlockedDate: expect.any(Object),
            milestoneType: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });

      it('passing IUserMilestone should create a new form with FormGroup', () => {
        const formGroup = service.createUserMilestoneFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            currentProgress: expect.any(Object),
            completed: expect.any(Object),
            unlockedDate: expect.any(Object),
            milestoneType: expect.any(Object),
            userProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getUserMilestone', () => {
      it('should return NewUserMilestone for default UserMilestone initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserMilestoneFormGroup(sampleWithNewData);

        const userMilestone = service.getUserMilestone(formGroup) as any;

        expect(userMilestone).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserMilestone for empty UserMilestone initial value', () => {
        const formGroup = service.createUserMilestoneFormGroup();

        const userMilestone = service.getUserMilestone(formGroup) as any;

        expect(userMilestone).toMatchObject({});
      });

      it('should return IUserMilestone', () => {
        const formGroup = service.createUserMilestoneFormGroup(sampleWithRequiredData);

        const userMilestone = service.getUserMilestone(formGroup) as any;

        expect(userMilestone).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserMilestone should not enable id FormControl', () => {
        const formGroup = service.createUserMilestoneFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserMilestone should disable id FormControl', () => {
        const formGroup = service.createUserMilestoneFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
