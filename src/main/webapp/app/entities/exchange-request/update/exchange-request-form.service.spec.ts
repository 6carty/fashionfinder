import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../exchange-request.test-samples';

import { ExchangeRequestFormService } from './exchange-request-form.service';

describe('ExchangeRequest Form Service', () => {
  let service: ExchangeRequestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeRequestFormService);
  });

  describe('Service methods', () => {
    describe('createExchangeRequestFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExchangeRequestFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            offeringItem: expect.any(Object),
            requestedItem: expect.any(Object),
            requester: expect.any(Object),
          })
        );
      });

      it('passing IExchangeRequest should create a new form with FormGroup', () => {
        const formGroup = service.createExchangeRequestFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            offeringItem: expect.any(Object),
            requestedItem: expect.any(Object),
            requester: expect.any(Object),
          })
        );
      });
    });

    describe('getExchangeRequest', () => {
      it('should return NewExchangeRequest for default ExchangeRequest initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createExchangeRequestFormGroup(sampleWithNewData);

        const exchangeRequest = service.getExchangeRequest(formGroup) as any;

        expect(exchangeRequest).toMatchObject(sampleWithNewData);
      });

      it('should return NewExchangeRequest for empty ExchangeRequest initial value', () => {
        const formGroup = service.createExchangeRequestFormGroup();

        const exchangeRequest = service.getExchangeRequest(formGroup) as any;

        expect(exchangeRequest).toMatchObject({});
      });

      it('should return IExchangeRequest', () => {
        const formGroup = service.createExchangeRequestFormGroup(sampleWithRequiredData);

        const exchangeRequest = service.getExchangeRequest(formGroup) as any;

        expect(exchangeRequest).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExchangeRequest should not enable id FormControl', () => {
        const formGroup = service.createExchangeRequestFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExchangeRequest should disable id FormControl', () => {
        const formGroup = service.createExchangeRequestFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
