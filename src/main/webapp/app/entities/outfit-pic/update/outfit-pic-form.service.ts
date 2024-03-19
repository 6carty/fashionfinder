import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOutfitPic, NewOutfitPic } from '../outfit-pic.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOutfitPic for edit and NewOutfitPicFormGroupInput for create.
 */
type OutfitPicFormGroupInput = IOutfitPic | PartialWithRequiredKeyOf<NewOutfitPic>;

type OutfitPicFormDefaults = Pick<NewOutfitPic, 'id'>;

type OutfitPicFormGroupContent = {
  id: FormControl<IOutfitPic['id'] | NewOutfitPic['id']>;
  image: FormControl<IOutfitPic['image']>;
  imageContentType: FormControl<IOutfitPic['imageContentType']>;
  outfit: FormControl<IOutfitPic['outfit']>;
};

export type OutfitPicFormGroup = FormGroup<OutfitPicFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OutfitPicFormService {
  createOutfitPicFormGroup(outfitPic: OutfitPicFormGroupInput = { id: null }): OutfitPicFormGroup {
    const outfitPicRawValue = {
      ...this.getFormDefaults(),
      ...outfitPic,
    };
    return new FormGroup<OutfitPicFormGroupContent>({
      id: new FormControl(
        { value: outfitPicRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      image: new FormControl(outfitPicRawValue.image),
      imageContentType: new FormControl(outfitPicRawValue.imageContentType),
      outfit: new FormControl(outfitPicRawValue.outfit),
    });
  }

  getOutfitPic(form: OutfitPicFormGroup): IOutfitPic | NewOutfitPic {
    return form.getRawValue() as IOutfitPic | NewOutfitPic;
  }

  resetForm(form: OutfitPicFormGroup, outfitPic: OutfitPicFormGroupInput): void {
    const outfitPicRawValue = { ...this.getFormDefaults(), ...outfitPic };
    form.reset(
      {
        ...outfitPicRawValue,
        id: { value: outfitPicRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OutfitPicFormDefaults {
    return {
      id: null,
    };
  }
}
