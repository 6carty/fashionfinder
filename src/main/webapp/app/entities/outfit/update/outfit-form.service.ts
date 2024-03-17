import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOutfit, NewOutfit } from '../outfit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOutfit for edit and NewOutfitFormGroupInput for create.
 */
type OutfitFormGroupInput = IOutfit | PartialWithRequiredKeyOf<NewOutfit>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOutfit | NewOutfit> = Omit<T, 'date'> & {
  date?: string | null;
};

type OutfitFormRawValue = FormValueOf<IOutfit>;

type NewOutfitFormRawValue = FormValueOf<NewOutfit>;

type OutfitFormDefaults = Pick<NewOutfit, 'id' | 'date' | 'clothingItems'>;

type OutfitFormGroupContent = {
  id: FormControl<OutfitFormRawValue['id'] | NewOutfit['id']>;
  name: FormControl<OutfitFormRawValue['name']>;
  description: FormControl<OutfitFormRawValue['description']>;
  date: FormControl<OutfitFormRawValue['date']>;
  occasion: FormControl<OutfitFormRawValue['occasion']>;
  image: FormControl<OutfitFormRawValue['image']>;
  imageContentType: FormControl<OutfitFormRawValue['imageContentType']>;
  rating: FormControl<OutfitFormRawValue['rating']>;
  event: FormControl<OutfitFormRawValue['event']>;
  creator: FormControl<OutfitFormRawValue['creator']>;
  clothingItems: FormControl<OutfitFormRawValue['clothingItems']>;
};

export type OutfitFormGroup = FormGroup<OutfitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OutfitFormService {
  createOutfitFormGroup(outfit: OutfitFormGroupInput = { id: null }): OutfitFormGroup {
    const outfitRawValue = this.convertOutfitToOutfitRawValue({
      ...this.getFormDefaults(),
      ...outfit,
    });
    return new FormGroup<OutfitFormGroupContent>({
      id: new FormControl(
        { value: outfitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(outfitRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(outfitRawValue.description),
      date: new FormControl(outfitRawValue.date),
      occasion: new FormControl(outfitRawValue.occasion, {
        validators: [Validators.required],
      }),
      image: new FormControl(outfitRawValue.image),
      imageContentType: new FormControl(outfitRawValue.imageContentType),
      rating: new FormControl(outfitRawValue.rating),
      event: new FormControl(outfitRawValue.event),
      creator: new FormControl(outfitRawValue.creator),
      clothingItems: new FormControl(outfitRawValue.clothingItems ?? []),
    });
  }

  getOutfit(form: OutfitFormGroup): IOutfit | NewOutfit {
    return this.convertOutfitRawValueToOutfit(form.getRawValue() as OutfitFormRawValue | NewOutfitFormRawValue);
  }

  resetForm(form: OutfitFormGroup, outfit: OutfitFormGroupInput): void {
    const outfitRawValue = this.convertOutfitToOutfitRawValue({ ...this.getFormDefaults(), ...outfit });
    form.reset(
      {
        ...outfitRawValue,
        id: { value: outfitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OutfitFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      clothingItems: [],
    };
  }

  private convertOutfitRawValueToOutfit(rawOutfit: OutfitFormRawValue | NewOutfitFormRawValue): IOutfit | NewOutfit {
    return {
      ...rawOutfit,
      date: dayjs(rawOutfit.date, DATE_TIME_FORMAT),
    };
  }

  private convertOutfitToOutfitRawValue(
    outfit: IOutfit | (Partial<NewOutfit> & OutfitFormDefaults)
  ): OutfitFormRawValue | PartialWithRequiredKeyOf<NewOutfitFormRawValue> {
    return {
      ...outfit,
      date: outfit.date ? outfit.date.format(DATE_TIME_FORMAT) : undefined,
      clothingItems: outfit.clothingItems ?? [],
    };
  }
}
