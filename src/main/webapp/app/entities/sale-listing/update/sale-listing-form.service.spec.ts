import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sale-listing.test-samples';

import { SaleListingFormService } from './sale-listing-form.service';

describe('SaleListing Form Service', () => {
  let service: SaleListingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleListingFormService);
  });

  describe('Service methods', () => {
    describe('createSaleListingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSaleListingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemForSale: expect.any(Object),
            price: expect.any(Object),
            seller: expect.any(Object),
          })
        );
      });

      it('passing ISaleListing should create a new form with FormGroup', () => {
        const formGroup = service.createSaleListingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemForSale: expect.any(Object),
            price: expect.any(Object),
            seller: expect.any(Object),
          })
        );
      });
    });

    describe('getSaleListing', () => {
      it('should return NewSaleListing for default SaleListing initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSaleListingFormGroup(sampleWithNewData);

        const saleListing = service.getSaleListing(formGroup) as any;

        expect(saleListing).toMatchObject(sampleWithNewData);
      });

      it('should return NewSaleListing for empty SaleListing initial value', () => {
        const formGroup = service.createSaleListingFormGroup();

        const saleListing = service.getSaleListing(formGroup) as any;

        expect(saleListing).toMatchObject({});
      });

      it('should return ISaleListing', () => {
        const formGroup = service.createSaleListingFormGroup(sampleWithRequiredData);

        const saleListing = service.getSaleListing(formGroup) as any;

        expect(saleListing).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISaleListing should not enable id FormControl', () => {
        const formGroup = service.createSaleListingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSaleListing should disable id FormControl', () => {
        const formGroup = service.createSaleListingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
