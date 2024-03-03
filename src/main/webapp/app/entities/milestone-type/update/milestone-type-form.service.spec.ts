import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../milestone-type.test-samples';

import { MilestoneTypeFormService } from './milestone-type-form.service';

describe('MilestoneType Form Service', () => {
  let service: MilestoneTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilestoneTypeFormService);
  });

  describe('Service methods', () => {
    describe('createMilestoneTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMilestoneTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            initialTarget: expect.any(Object),
            nextTarget: expect.any(Object),
          })
        );
      });

      it('passing IMilestoneType should create a new form with FormGroup', () => {
        const formGroup = service.createMilestoneTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            initialTarget: expect.any(Object),
            nextTarget: expect.any(Object),
          })
        );
      });
    });

    describe('getMilestoneType', () => {
      it('should return NewMilestoneType for default MilestoneType initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMilestoneTypeFormGroup(sampleWithNewData);

        const milestoneType = service.getMilestoneType(formGroup) as any;

        expect(milestoneType).toMatchObject(sampleWithNewData);
      });

      it('should return NewMilestoneType for empty MilestoneType initial value', () => {
        const formGroup = service.createMilestoneTypeFormGroup();

        const milestoneType = service.getMilestoneType(formGroup) as any;

        expect(milestoneType).toMatchObject({});
      });

      it('should return IMilestoneType', () => {
        const formGroup = service.createMilestoneTypeFormGroup(sampleWithRequiredData);

        const milestoneType = service.getMilestoneType(formGroup) as any;

        expect(milestoneType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMilestoneType should not enable id FormControl', () => {
        const formGroup = service.createMilestoneTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMilestoneType should disable id FormControl', () => {
        const formGroup = service.createMilestoneTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
