import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../outfit-pic.test-samples';

import { OutfitPicFormService } from './outfit-pic-form.service';

describe('OutfitPic Form Service', () => {
  let service: OutfitPicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutfitPicFormService);
  });

  describe('Service methods', () => {
    describe('createOutfitPicFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOutfitPicFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            outfit: expect.any(Object),
          })
        );
      });

      it('passing IOutfitPic should create a new form with FormGroup', () => {
        const formGroup = service.createOutfitPicFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            outfit: expect.any(Object),
          })
        );
      });
    });

    describe('getOutfitPic', () => {
      it('should return NewOutfitPic for default OutfitPic initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOutfitPicFormGroup(sampleWithNewData);

        const outfitPic = service.getOutfitPic(formGroup) as any;

        expect(outfitPic).toMatchObject(sampleWithNewData);
      });

      it('should return NewOutfitPic for empty OutfitPic initial value', () => {
        const formGroup = service.createOutfitPicFormGroup();

        const outfitPic = service.getOutfitPic(formGroup) as any;

        expect(outfitPic).toMatchObject({});
      });

      it('should return IOutfitPic', () => {
        const formGroup = service.createOutfitPicFormGroup(sampleWithRequiredData);

        const outfitPic = service.getOutfitPic(formGroup) as any;

        expect(outfitPic).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOutfitPic should not enable id FormControl', () => {
        const formGroup = service.createOutfitPicFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOutfitPic should disable id FormControl', () => {
        const formGroup = service.createOutfitPicFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
