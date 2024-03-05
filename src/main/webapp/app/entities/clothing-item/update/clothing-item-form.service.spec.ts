import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../clothing-item.test-samples';

import { ClothingItemFormService } from './clothing-item-form.service';

describe('ClothingItem Form Service', () => {
  let service: ClothingItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothingItemFormService);
  });

  describe('Service methods', () => {
    describe('createClothingItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClothingItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            clothingImg: expect.any(Object),
            description: expect.any(Object),
            clothingSize: expect.any(Object),
            colour: expect.any(Object),
            style: expect.any(Object),
            brand: expect.any(Object),
            material: expect.any(Object),
            status: expect.any(Object),
            lastWorn: expect.any(Object),
            event: expect.any(Object),
            outfits: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });

      it('passing IClothingItem should create a new form with FormGroup', () => {
        const formGroup = service.createClothingItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            clothingImg: expect.any(Object),
            description: expect.any(Object),
            clothingSize: expect.any(Object),
            colour: expect.any(Object),
            style: expect.any(Object),
            brand: expect.any(Object),
            material: expect.any(Object),
            status: expect.any(Object),
            lastWorn: expect.any(Object),
            event: expect.any(Object),
            outfits: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });
    });

    describe('getClothingItem', () => {
      it('should return NewClothingItem for default ClothingItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createClothingItemFormGroup(sampleWithNewData);

        const clothingItem = service.getClothingItem(formGroup) as any;

        expect(clothingItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewClothingItem for empty ClothingItem initial value', () => {
        const formGroup = service.createClothingItemFormGroup();

        const clothingItem = service.getClothingItem(formGroup) as any;

        expect(clothingItem).toMatchObject({});
      });

      it('should return IClothingItem', () => {
        const formGroup = service.createClothingItemFormGroup(sampleWithRequiredData);

        const clothingItem = service.getClothingItem(formGroup) as any;

        expect(clothingItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClothingItem should not enable id FormControl', () => {
        const formGroup = service.createClothingItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClothingItem should disable id FormControl', () => {
        const formGroup = service.createClothingItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
