import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITrendingOutfit, NewTrendingOutfit } from '../trending-outfit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITrendingOutfit for edit and NewTrendingOutfitFormGroupInput for create.
 */
type TrendingOutfitFormGroupInput = ITrendingOutfit | PartialWithRequiredKeyOf<NewTrendingOutfit>;

type TrendingOutfitFormDefaults = Pick<NewTrendingOutfit, 'id'>;

type TrendingOutfitFormGroupContent = {
  id: FormControl<ITrendingOutfit['id'] | NewTrendingOutfit['id']>;
  name: FormControl<ITrendingOutfit['name']>;
  description: FormControl<ITrendingOutfit['description']>;
  rating: FormControl<ITrendingOutfit['rating']>;
};

export type TrendingOutfitFormGroup = FormGroup<TrendingOutfitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TrendingOutfitFormService {
  createTrendingOutfitFormGroup(trendingOutfit: TrendingOutfitFormGroupInput = { id: null }): TrendingOutfitFormGroup {
    const trendingOutfitRawValue = {
      ...this.getFormDefaults(),
      ...trendingOutfit,
    };
    return new FormGroup<TrendingOutfitFormGroupContent>({
      id: new FormControl(
        { value: trendingOutfitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(trendingOutfitRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(trendingOutfitRawValue.description),
      rating: new FormControl(trendingOutfitRawValue.rating),
    });
  }

  getTrendingOutfit(form: TrendingOutfitFormGroup): ITrendingOutfit | NewTrendingOutfit {
    return form.getRawValue() as ITrendingOutfit | NewTrendingOutfit;
  }

  resetForm(form: TrendingOutfitFormGroup, trendingOutfit: TrendingOutfitFormGroupInput): void {
    const trendingOutfitRawValue = { ...this.getFormDefaults(), ...trendingOutfit };
    form.reset(
      {
        ...trendingOutfitRawValue,
        id: { value: trendingOutfitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TrendingOutfitFormDefaults {
    return {
      id: null,
    };
  }
}
