import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../outfit.test-samples';

import { OutfitFormService } from './outfit-form.service';

describe('Outfit Form Service', () => {
  let service: OutfitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutfitFormService);
  });

  describe('Service methods', () => {
    describe('createOutfitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOutfitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            occasion: expect.any(Object),
            weather: expect.any(Object),
            rating: expect.any(Object),
            event: expect.any(Object),
            creator: expect.any(Object),
            clothingItems: expect.any(Object),
          })
        );
      });

      it('passing IOutfit should create a new form with FormGroup', () => {
        const formGroup = service.createOutfitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            occasion: expect.any(Object),
            weather: expect.any(Object),
            rating: expect.any(Object),
            event: expect.any(Object),
            creator: expect.any(Object),
            clothingItems: expect.any(Object),
          })
        );
      });
    });

    describe('getOutfit', () => {
      it('should return NewOutfit for default Outfit initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOutfitFormGroup(sampleWithNewData);

        const outfit = service.getOutfit(formGroup) as any;

        expect(outfit).toMatchObject(sampleWithNewData);
      });

      it('should return NewOutfit for empty Outfit initial value', () => {
        const formGroup = service.createOutfitFormGroup();

        const outfit = service.getOutfit(formGroup) as any;

        expect(outfit).toMatchObject({});
      });

      it('should return IOutfit', () => {
        const formGroup = service.createOutfitFormGroup(sampleWithRequiredData);

        const outfit = service.getOutfit(formGroup) as any;

        expect(outfit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOutfit should not enable id FormControl', () => {
        const formGroup = service.createOutfitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOutfit should disable id FormControl', () => {
        const formGroup = service.createOutfitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
