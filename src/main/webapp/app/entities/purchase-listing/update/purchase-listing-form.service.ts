import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPurchaseListing, NewPurchaseListing } from '../purchase-listing.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPurchaseListing for edit and NewPurchaseListingFormGroupInput for create.
 */
type PurchaseListingFormGroupInput = IPurchaseListing | PartialWithRequiredKeyOf<NewPurchaseListing>;

type PurchaseListingFormDefaults = Pick<NewPurchaseListing, 'id'>;

type PurchaseListingFormGroupContent = {
  id: FormControl<IPurchaseListing['id'] | NewPurchaseListing['id']>;
  itemForSale: FormControl<IPurchaseListing['itemForSale']>;
  price: FormControl<IPurchaseListing['price']>;
  seller: FormControl<IPurchaseListing['seller']>;
};

export type PurchaseListingFormGroup = FormGroup<PurchaseListingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PurchaseListingFormService {
  createPurchaseListingFormGroup(purchaseListing: PurchaseListingFormGroupInput = { id: null }): PurchaseListingFormGroup {
    const purchaseListingRawValue = {
      ...this.getFormDefaults(),
      ...purchaseListing,
    };
    return new FormGroup<PurchaseListingFormGroupContent>({
      id: new FormControl(
        { value: purchaseListingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      itemForSale: new FormControl(purchaseListingRawValue.itemForSale, {
        validators: [Validators.required],
      }),
      price: new FormControl(purchaseListingRawValue.price, {
        validators: [Validators.required],
      }),
      seller: new FormControl(purchaseListingRawValue.seller),
    });
  }

  getPurchaseListing(form: PurchaseListingFormGroup): IPurchaseListing | NewPurchaseListing {
    return form.getRawValue() as IPurchaseListing | NewPurchaseListing;
  }

  resetForm(form: PurchaseListingFormGroup, purchaseListing: PurchaseListingFormGroupInput): void {
    const purchaseListingRawValue = { ...this.getFormDefaults(), ...purchaseListing };
    form.reset(
      {
        ...purchaseListingRawValue,
        id: { value: purchaseListingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PurchaseListingFormDefaults {
    return {
      id: null,
    };
  }
}
