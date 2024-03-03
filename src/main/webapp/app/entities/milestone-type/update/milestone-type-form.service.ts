import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMilestoneType, NewMilestoneType } from '../milestone-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMilestoneType for edit and NewMilestoneTypeFormGroupInput for create.
 */
type MilestoneTypeFormGroupInput = IMilestoneType | PartialWithRequiredKeyOf<NewMilestoneType>;

type MilestoneTypeFormDefaults = Pick<NewMilestoneType, 'id'>;

type MilestoneTypeFormGroupContent = {
  id: FormControl<IMilestoneType['id'] | NewMilestoneType['id']>;
  name: FormControl<IMilestoneType['name']>;
  initialTarget: FormControl<IMilestoneType['initialTarget']>;
  nextTarget: FormControl<IMilestoneType['nextTarget']>;
};

export type MilestoneTypeFormGroup = FormGroup<MilestoneTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MilestoneTypeFormService {
  createMilestoneTypeFormGroup(milestoneType: MilestoneTypeFormGroupInput = { id: null }): MilestoneTypeFormGroup {
    const milestoneTypeRawValue = {
      ...this.getFormDefaults(),
      ...milestoneType,
    };
    return new FormGroup<MilestoneTypeFormGroupContent>({
      id: new FormControl(
        { value: milestoneTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(milestoneTypeRawValue.name, {
        validators: [Validators.required],
      }),
      initialTarget: new FormControl(milestoneTypeRawValue.initialTarget, {
        validators: [Validators.required],
      }),
      nextTarget: new FormControl(milestoneTypeRawValue.nextTarget),
    });
  }

  getMilestoneType(form: MilestoneTypeFormGroup): IMilestoneType | NewMilestoneType {
    return form.getRawValue() as IMilestoneType | NewMilestoneType;
  }

  resetForm(form: MilestoneTypeFormGroup, milestoneType: MilestoneTypeFormGroupInput): void {
    const milestoneTypeRawValue = { ...this.getFormDefaults(), ...milestoneType };
    form.reset(
      {
        ...milestoneTypeRawValue,
        id: { value: milestoneTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MilestoneTypeFormDefaults {
    return {
      id: null,
    };
  }
}
