import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IClothingPic, NewClothingPic } from '../clothing-pic.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClothingPic for edit and NewClothingPicFormGroupInput for create.
 */
type ClothingPicFormGroupInput = IClothingPic | PartialWithRequiredKeyOf<NewClothingPic>;

type ClothingPicFormDefaults = Pick<NewClothingPic, 'id'>;

type ClothingPicFormGroupContent = {
  id: FormControl<IClothingPic['id'] | NewClothingPic['id']>;
  image: FormControl<IClothingPic['image']>;
  imageContentType: FormControl<IClothingPic['imageContentType']>;
  clothingItem: FormControl<IClothingPic['clothingItem']>;
};

export type ClothingPicFormGroup = FormGroup<ClothingPicFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClothingPicFormService {
  createClothingPicFormGroup(clothingPic: ClothingPicFormGroupInput = { id: null }): ClothingPicFormGroup {
    const clothingPicRawValue = {
      ...this.getFormDefaults(),
      ...clothingPic,
    };
    return new FormGroup<ClothingPicFormGroupContent>({
      id: new FormControl(
        { value: clothingPicRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      image: new FormControl(clothingPicRawValue.image),
      imageContentType: new FormControl(clothingPicRawValue.imageContentType),
      clothingItem: new FormControl(clothingPicRawValue.clothingItem),
    });
  }

  getClothingPic(form: ClothingPicFormGroup): IClothingPic | NewClothingPic {
    return form.getRawValue() as IClothingPic | NewClothingPic;
  }

  resetForm(form: ClothingPicFormGroup, clothingPic: ClothingPicFormGroupInput): void {
    const clothingPicRawValue = { ...this.getFormDefaults(), ...clothingPic };
    form.reset(
      {
        ...clothingPicRawValue,
        id: { value: clothingPicRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClothingPicFormDefaults {
    return {
      id: null,
    };
  }
}
