import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../purchase-listing.test-samples';

import { PurchaseListingFormService } from './purchase-listing-form.service';

describe('PurchaseListing Form Service', () => {
  let service: PurchaseListingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseListingFormService);
  });

  describe('Service methods', () => {
    describe('createPurchaseListingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPurchaseListingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemForSale: expect.any(Object),
            price: expect.any(Object),
            seller: expect.any(Object),
          })
        );
      });

      it('passing IPurchaseListing should create a new form with FormGroup', () => {
        const formGroup = service.createPurchaseListingFormGroup(sampleWithRequiredData);

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

    describe('getPurchaseListing', () => {
      it('should return NewPurchaseListing for default PurchaseListing initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPurchaseListingFormGroup(sampleWithNewData);

        const purchaseListing = service.getPurchaseListing(formGroup) as any;

        expect(purchaseListing).toMatchObject(sampleWithNewData);
      });

      it('should return NewPurchaseListing for empty PurchaseListing initial value', () => {
        const formGroup = service.createPurchaseListingFormGroup();

        const purchaseListing = service.getPurchaseListing(formGroup) as any;

        expect(purchaseListing).toMatchObject({});
      });

      it('should return IPurchaseListing', () => {
        const formGroup = service.createPurchaseListingFormGroup(sampleWithRequiredData);

        const purchaseListing = service.getPurchaseListing(formGroup) as any;

        expect(purchaseListing).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPurchaseListing should not enable id FormControl', () => {
        const formGroup = service.createPurchaseListingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPurchaseListing should disable id FormControl', () => {
        const formGroup = service.createPurchaseListingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
