import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExchangeRequest, NewExchangeRequest } from '../exchange-request.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExchangeRequest for edit and NewExchangeRequestFormGroupInput for create.
 */
type ExchangeRequestFormGroupInput = IExchangeRequest | PartialWithRequiredKeyOf<NewExchangeRequest>;

type ExchangeRequestFormDefaults = Pick<NewExchangeRequest, 'id'>;

type ExchangeRequestFormGroupContent = {
  id: FormControl<IExchangeRequest['id'] | NewExchangeRequest['id']>;
  image: FormControl<IExchangeRequest['image']>;
  imageContentType: FormControl<IExchangeRequest['imageContentType']>;
  description: FormControl<IExchangeRequest['description']>;
  clothingItem: FormControl<IExchangeRequest['clothingItem']>;
  creater: FormControl<IExchangeRequest['creater']>;
  requester: FormControl<IExchangeRequest['requester']>;
};

export type ExchangeRequestFormGroup = FormGroup<ExchangeRequestFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExchangeRequestFormService {
  createExchangeRequestFormGroup(exchangeRequest: ExchangeRequestFormGroupInput = { id: null }): ExchangeRequestFormGroup {
    const exchangeRequestRawValue = {
      ...this.getFormDefaults(),
      ...exchangeRequest,
    };
    return new FormGroup<ExchangeRequestFormGroupContent>({
      id: new FormControl(
        { value: exchangeRequestRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      image: new FormControl(exchangeRequestRawValue.image),
      imageContentType: new FormControl(exchangeRequestRawValue.imageContentType),
      description: new FormControl(exchangeRequestRawValue.description, {
        validators: [Validators.required],
      }),
      clothingItem: new FormControl(exchangeRequestRawValue.clothingItem),
      creater: new FormControl(exchangeRequestRawValue.creater),
      requester: new FormControl(exchangeRequestRawValue.requester),
    });
  }

  getExchangeRequest(form: ExchangeRequestFormGroup): IExchangeRequest | NewExchangeRequest {
    return form.getRawValue() as IExchangeRequest | NewExchangeRequest;
  }

  resetForm(form: ExchangeRequestFormGroup, exchangeRequest: ExchangeRequestFormGroupInput): void {
    const exchangeRequestRawValue = { ...this.getFormDefaults(), ...exchangeRequest };
    form.reset(
      {
        ...exchangeRequestRawValue,
        id: { value: exchangeRequestRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExchangeRequestFormDefaults {
    return {
      id: null,
    };
  }
}
