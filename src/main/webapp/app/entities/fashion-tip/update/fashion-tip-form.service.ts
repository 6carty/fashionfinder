import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFashionTip, NewFashionTip } from '../fashion-tip.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFashionTip for edit and NewFashionTipFormGroupInput for create.
 */
type FashionTipFormGroupInput = IFashionTip | PartialWithRequiredKeyOf<NewFashionTip>;

type FashionTipFormDefaults = Pick<NewFashionTip, 'id'>;

type FashionTipFormGroupContent = {
  id: FormControl<IFashionTip['id'] | NewFashionTip['id']>;
  title1: FormControl<IFashionTip['title1']>;
  description1: FormControl<IFashionTip['description1']>;
  author: FormControl<IFashionTip['author']>;
};

export type FashionTipFormGroup = FormGroup<FashionTipFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FashionTipFormService {
  createFashionTipFormGroup(fashionTip: FashionTipFormGroupInput = { id: null }): FashionTipFormGroup {
    const fashionTipRawValue = {
      ...this.getFormDefaults(),
      ...fashionTip,
    };
    return new FormGroup<FashionTipFormGroupContent>({
      id: new FormControl(
        { value: fashionTipRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title1: new FormControl(fashionTipRawValue.title1, {
        validators: [Validators.required],
      }),
      description1: new FormControl(fashionTipRawValue.description1),
      author: new FormControl(fashionTipRawValue.author),
    });
  }

  getFashionTip(form: FashionTipFormGroup): IFashionTip | NewFashionTip {
    return form.getRawValue() as IFashionTip | NewFashionTip;
  }

  resetForm(form: FashionTipFormGroup, fashionTip: FashionTipFormGroupInput): void {
    const fashionTipRawValue = { ...this.getFormDefaults(), ...fashionTip };
    form.reset(
      {
        ...fashionTipRawValue,
        id: { value: fashionTipRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FashionTipFormDefaults {
    return {
      id: null,
    };
  }
}
