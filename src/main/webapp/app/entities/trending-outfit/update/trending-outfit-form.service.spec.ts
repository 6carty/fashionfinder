import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../trending-outfit.test-samples';

import { TrendingOutfitFormService } from './trending-outfit-form.service';

describe('TrendingOutfit Form Service', () => {
  let service: TrendingOutfitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrendingOutfitFormService);
  });

  describe('Service methods', () => {
    describe('createTrendingOutfitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTrendingOutfitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            rating: expect.any(Object),
          })
        );
      });

      it('passing ITrendingOutfit should create a new form with FormGroup', () => {
        const formGroup = service.createTrendingOutfitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            rating: expect.any(Object),
          })
        );
      });
    });

    describe('getTrendingOutfit', () => {
      it('should return NewTrendingOutfit for default TrendingOutfit initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTrendingOutfitFormGroup(sampleWithNewData);

        const trendingOutfit = service.getTrendingOutfit(formGroup) as any;

        expect(trendingOutfit).toMatchObject(sampleWithNewData);
      });

      it('should return NewTrendingOutfit for empty TrendingOutfit initial value', () => {
        const formGroup = service.createTrendingOutfitFormGroup();

        const trendingOutfit = service.getTrendingOutfit(formGroup) as any;

        expect(trendingOutfit).toMatchObject({});
      });

      it('should return ITrendingOutfit', () => {
        const formGroup = service.createTrendingOutfitFormGroup(sampleWithRequiredData);

        const trendingOutfit = service.getTrendingOutfit(formGroup) as any;

        expect(trendingOutfit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITrendingOutfit should not enable id FormControl', () => {
        const formGroup = service.createTrendingOutfitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTrendingOutfit should disable id FormControl', () => {
        const formGroup = service.createTrendingOutfitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
