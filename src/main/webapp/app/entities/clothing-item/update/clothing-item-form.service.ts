import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IClothingItem, NewClothingItem } from '../clothing-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClothingItem for edit and NewClothingItemFormGroupInput for create.
 */
type ClothingItemFormGroupInput = IClothingItem | PartialWithRequiredKeyOf<NewClothingItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IClothingItem | NewClothingItem> = Omit<T, 'lastWorn'> & {
  lastWorn?: string | null;
};

type ClothingItemFormRawValue = FormValueOf<IClothingItem>;

type NewClothingItemFormRawValue = FormValueOf<NewClothingItem>;

type ClothingItemFormDefaults = Pick<NewClothingItem, 'id' | 'lastWorn' | 'outfits'>;

type ClothingItemFormGroupContent = {
  id: FormControl<ClothingItemFormRawValue['id'] | NewClothingItem['id']>;
  name: FormControl<ClothingItemFormRawValue['name']>;
  type: FormControl<ClothingItemFormRawValue['type']>;
  clothingImg: FormControl<ClothingItemFormRawValue['clothingImg']>;
  clothingImgContentType: FormControl<ClothingItemFormRawValue['clothingImgContentType']>;
  description: FormControl<ClothingItemFormRawValue['description']>;
  clothingSize: FormControl<ClothingItemFormRawValue['clothingSize']>;
  colour: FormControl<ClothingItemFormRawValue['colour']>;
  style: FormControl<ClothingItemFormRawValue['style']>;
  brand: FormControl<ClothingItemFormRawValue['brand']>;
  material: FormControl<ClothingItemFormRawValue['material']>;
  status: FormControl<ClothingItemFormRawValue['status']>;
  lastWorn: FormControl<ClothingItemFormRawValue['lastWorn']>;
  event: FormControl<ClothingItemFormRawValue['event']>;
  outfits: FormControl<ClothingItemFormRawValue['outfits']>;
  owner: FormControl<ClothingItemFormRawValue['owner']>;
};

export type ClothingItemFormGroup = FormGroup<ClothingItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClothingItemFormService {
  createClothingItemFormGroup(clothingItem: ClothingItemFormGroupInput = { id: null }): ClothingItemFormGroup {
    const clothingItemRawValue = this.convertClothingItemToClothingItemRawValue({
      ...this.getFormDefaults(),
      ...clothingItem,
    });
    return new FormGroup<ClothingItemFormGroupContent>({
      id: new FormControl(
        { value: clothingItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(clothingItemRawValue.name, {
        validators: [Validators.required],
      }),
      type: new FormControl(clothingItemRawValue.type, {
        validators: [Validators.required],
      }),
      clothingImg: new FormControl(clothingItemRawValue.clothingImg, {
        validators: [Validators.required],
      }),
      clothingImgContentType: new FormControl(clothingItemRawValue.clothingImgContentType),
      description: new FormControl(clothingItemRawValue.description),
      clothingSize: new FormControl(clothingItemRawValue.clothingSize),
      colour: new FormControl(clothingItemRawValue.colour),
      style: new FormControl(clothingItemRawValue.style),
      brand: new FormControl(clothingItemRawValue.brand),
      material: new FormControl(clothingItemRawValue.material),
      status: new FormControl(clothingItemRawValue.status, {
        validators: [Validators.required],
      }),
      lastWorn: new FormControl(clothingItemRawValue.lastWorn),
      event: new FormControl(clothingItemRawValue.event),
      outfits: new FormControl(clothingItemRawValue.outfits ?? []),
      owner: new FormControl(clothingItemRawValue.owner),
    });
  }

  getClothingItem(form: ClothingItemFormGroup): IClothingItem | NewClothingItem {
    return this.convertClothingItemRawValueToClothingItem(form.getRawValue() as ClothingItemFormRawValue | NewClothingItemFormRawValue);
  }

  resetForm(form: ClothingItemFormGroup, clothingItem: ClothingItemFormGroupInput): void {
    const clothingItemRawValue = this.convertClothingItemToClothingItemRawValue({ ...this.getFormDefaults(), ...clothingItem });
    form.reset(
      {
        ...clothingItemRawValue,
        id: { value: clothingItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClothingItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastWorn: currentTime,
      outfits: [],
    };
  }

  private convertClothingItemRawValueToClothingItem(
    rawClothingItem: ClothingItemFormRawValue | NewClothingItemFormRawValue
  ): IClothingItem | NewClothingItem {
    return {
      ...rawClothingItem,
      lastWorn: dayjs(rawClothingItem.lastWorn, DATE_TIME_FORMAT),
    };
  }

  private convertClothingItemToClothingItemRawValue(
    clothingItem: IClothingItem | (Partial<NewClothingItem> & ClothingItemFormDefaults)
  ): ClothingItemFormRawValue | PartialWithRequiredKeyOf<NewClothingItemFormRawValue> {
    return {
      ...clothingItem,
      lastWorn: clothingItem.lastWorn ? clothingItem.lastWorn.format(DATE_TIME_FORMAT) : undefined,
      outfits: clothingItem.outfits ?? [],
    };
  }
}
