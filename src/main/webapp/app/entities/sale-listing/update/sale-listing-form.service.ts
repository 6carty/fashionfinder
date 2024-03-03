import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISaleListing, NewSaleListing } from '../sale-listing.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISaleListing for edit and NewSaleListingFormGroupInput for create.
 */
type SaleListingFormGroupInput = ISaleListing | PartialWithRequiredKeyOf<NewSaleListing>;

type SaleListingFormDefaults = Pick<NewSaleListing, 'id'>;

type SaleListingFormGroupContent = {
  id: FormControl<ISaleListing['id'] | NewSaleListing['id']>;
  itemForSale: FormControl<ISaleListing['itemForSale']>;
  price: FormControl<ISaleListing['price']>;
  seller: FormControl<ISaleListing['seller']>;
};

export type SaleListingFormGroup = FormGroup<SaleListingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SaleListingFormService {
  createSaleListingFormGroup(saleListing: SaleListingFormGroupInput = { id: null }): SaleListingFormGroup {
    const saleListingRawValue = {
      ...this.getFormDefaults(),
      ...saleListing,
    };
    return new FormGroup<SaleListingFormGroupContent>({
      id: new FormControl(
        { value: saleListingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      itemForSale: new FormControl(saleListingRawValue.itemForSale, {
        validators: [Validators.required],
      }),
      price: new FormControl(saleListingRawValue.price, {
        validators: [Validators.required],
      }),
      seller: new FormControl(saleListingRawValue.seller),
    });
  }

  getSaleListing(form: SaleListingFormGroup): ISaleListing | NewSaleListing {
    return form.getRawValue() as ISaleListing | NewSaleListing;
  }

  resetForm(form: SaleListingFormGroup, saleListing: SaleListingFormGroupInput): void {
    const saleListingRawValue = { ...this.getFormDefaults(), ...saleListing };
    form.reset(
      {
        ...saleListingRawValue,
        id: { value: saleListingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SaleListingFormDefaults {
    return {
      id: null,
    };
  }
}
