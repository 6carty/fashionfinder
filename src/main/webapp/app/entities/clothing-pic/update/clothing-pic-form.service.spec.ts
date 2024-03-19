import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../clothing-pic.test-samples';

import { ClothingPicFormService } from './clothing-pic-form.service';

describe('ClothingPic Form Service', () => {
  let service: ClothingPicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothingPicFormService);
  });

  describe('Service methods', () => {
    describe('createClothingPicFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClothingPicFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            clothingItem: expect.any(Object),
          })
        );
      });

      it('passing IClothingPic should create a new form with FormGroup', () => {
        const formGroup = service.createClothingPicFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            clothingItem: expect.any(Object),
          })
        );
      });
    });

    describe('getClothingPic', () => {
      it('should return NewClothingPic for default ClothingPic initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createClothingPicFormGroup(sampleWithNewData);

        const clothingPic = service.getClothingPic(formGroup) as any;

        expect(clothingPic).toMatchObject(sampleWithNewData);
      });

      it('should return NewClothingPic for empty ClothingPic initial value', () => {
        const formGroup = service.createClothingPicFormGroup();

        const clothingPic = service.getClothingPic(formGroup) as any;

        expect(clothingPic).toMatchObject({});
      });

      it('should return IClothingPic', () => {
        const formGroup = service.createClothingPicFormGroup(sampleWithRequiredData);

        const clothingPic = service.getClothingPic(formGroup) as any;

        expect(clothingPic).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClothingPic should not enable id FormControl', () => {
        const formGroup = service.createClothingPicFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClothingPic should disable id FormControl', () => {
        const formGroup = service.createClothingPicFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
