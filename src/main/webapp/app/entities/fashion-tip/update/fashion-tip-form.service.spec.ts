import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fashion-tip.test-samples';

import { FashionTipFormService } from './fashion-tip-form.service';

describe('FashionTip Form Service', () => {
  let service: FashionTipFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FashionTipFormService);
  });

  describe('Service methods', () => {
    describe('createFashionTipFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFashionTipFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title1: expect.any(Object),
            description1: expect.any(Object),
            title2: expect.any(Object),
            description2: expect.any(Object),
            author: expect.any(Object),
          })
        );
      });

      it('passing IFashionTip should create a new form with FormGroup', () => {
        const formGroup = service.createFashionTipFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title1: expect.any(Object),
            description1: expect.any(Object),
            title2: expect.any(Object),
            description2: expect.any(Object),
            author: expect.any(Object),
          })
        );
      });
    });

    describe('getFashionTip', () => {
      it('should return NewFashionTip for default FashionTip initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFashionTipFormGroup(sampleWithNewData);

        const fashionTip = service.getFashionTip(formGroup) as any;

        expect(fashionTip).toMatchObject(sampleWithNewData);
      });

      it('should return NewFashionTip for empty FashionTip initial value', () => {
        const formGroup = service.createFashionTipFormGroup();

        const fashionTip = service.getFashionTip(formGroup) as any;

        expect(fashionTip).toMatchObject({});
      });

      it('should return IFashionTip', () => {
        const formGroup = service.createFashionTipFormGroup(sampleWithRequiredData);

        const fashionTip = service.getFashionTip(formGroup) as any;

        expect(fashionTip).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFashionTip should not enable id FormControl', () => {
        const formGroup = service.createFashionTipFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFashionTip should disable id FormControl', () => {
        const formGroup = service.createFashionTipFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
