import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-log.test-samples';

import { ItemLogFormService } from './item-log-form.service';

describe('ItemLog Form Service', () => {
  let service: ItemLogFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemLogFormService);
  });

  describe('Service methods', () => {
    describe('createItemLogFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemLogFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            owner: expect.any(Object),
            outfit: expect.any(Object),
          })
        );
      });

      it('passing IItemLog should create a new form with FormGroup', () => {
        const formGroup = service.createItemLogFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            owner: expect.any(Object),
            outfit: expect.any(Object),
          })
        );
      });
    });

    describe('getItemLog', () => {
      it('should return NewItemLog for default ItemLog initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemLogFormGroup(sampleWithNewData);

        const itemLog = service.getItemLog(formGroup) as any;

        expect(itemLog).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemLog for empty ItemLog initial value', () => {
        const formGroup = service.createItemLogFormGroup();

        const itemLog = service.getItemLog(formGroup) as any;

        expect(itemLog).toMatchObject({});
      });

      it('should return IItemLog', () => {
        const formGroup = service.createItemLogFormGroup(sampleWithRequiredData);

        const itemLog = service.getItemLog(formGroup) as any;

        expect(itemLog).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemLog should not enable id FormControl', () => {
        const formGroup = service.createItemLogFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemLog should disable id FormControl', () => {
        const formGroup = service.createItemLogFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
