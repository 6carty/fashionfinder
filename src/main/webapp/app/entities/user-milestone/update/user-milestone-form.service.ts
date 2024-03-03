import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserMilestone, NewUserMilestone } from '../user-milestone.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserMilestone for edit and NewUserMilestoneFormGroupInput for create.
 */
type UserMilestoneFormGroupInput = IUserMilestone | PartialWithRequiredKeyOf<NewUserMilestone>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserMilestone | NewUserMilestone> = Omit<T, 'unlockedDate'> & {
  unlockedDate?: string | null;
};

type UserMilestoneFormRawValue = FormValueOf<IUserMilestone>;

type NewUserMilestoneFormRawValue = FormValueOf<NewUserMilestone>;

type UserMilestoneFormDefaults = Pick<NewUserMilestone, 'id' | 'completed' | 'unlockedDate'>;

type UserMilestoneFormGroupContent = {
  id: FormControl<UserMilestoneFormRawValue['id'] | NewUserMilestone['id']>;
  currentProgress: FormControl<UserMilestoneFormRawValue['currentProgress']>;
  completed: FormControl<UserMilestoneFormRawValue['completed']>;
  unlockedDate: FormControl<UserMilestoneFormRawValue['unlockedDate']>;
  milestoneType: FormControl<UserMilestoneFormRawValue['milestoneType']>;
  userProfile: FormControl<UserMilestoneFormRawValue['userProfile']>;
};

export type UserMilestoneFormGroup = FormGroup<UserMilestoneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserMilestoneFormService {
  createUserMilestoneFormGroup(userMilestone: UserMilestoneFormGroupInput = { id: null }): UserMilestoneFormGroup {
    const userMilestoneRawValue = this.convertUserMilestoneToUserMilestoneRawValue({
      ...this.getFormDefaults(),
      ...userMilestone,
    });
    return new FormGroup<UserMilestoneFormGroupContent>({
      id: new FormControl(
        { value: userMilestoneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      currentProgress: new FormControl(userMilestoneRawValue.currentProgress, {
        validators: [Validators.required],
      }),
      completed: new FormControl(userMilestoneRawValue.completed, {
        validators: [Validators.required],
      }),
      unlockedDate: new FormControl(userMilestoneRawValue.unlockedDate),
      milestoneType: new FormControl(userMilestoneRawValue.milestoneType),
      userProfile: new FormControl(userMilestoneRawValue.userProfile),
    });
  }

  getUserMilestone(form: UserMilestoneFormGroup): IUserMilestone | NewUserMilestone {
    return this.convertUserMilestoneRawValueToUserMilestone(form.getRawValue() as UserMilestoneFormRawValue | NewUserMilestoneFormRawValue);
  }

  resetForm(form: UserMilestoneFormGroup, userMilestone: UserMilestoneFormGroupInput): void {
    const userMilestoneRawValue = this.convertUserMilestoneToUserMilestoneRawValue({ ...this.getFormDefaults(), ...userMilestone });
    form.reset(
      {
        ...userMilestoneRawValue,
        id: { value: userMilestoneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserMilestoneFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      completed: false,
      unlockedDate: currentTime,
    };
  }

  private convertUserMilestoneRawValueToUserMilestone(
    rawUserMilestone: UserMilestoneFormRawValue | NewUserMilestoneFormRawValue
  ): IUserMilestone | NewUserMilestone {
    return {
      ...rawUserMilestone,
      unlockedDate: dayjs(rawUserMilestone.unlockedDate, DATE_TIME_FORMAT),
    };
  }

  private convertUserMilestoneToUserMilestoneRawValue(
    userMilestone: IUserMilestone | (Partial<NewUserMilestone> & UserMilestoneFormDefaults)
  ): UserMilestoneFormRawValue | PartialWithRequiredKeyOf<NewUserMilestoneFormRawValue> {
    return {
      ...userMilestone,
      unlockedDate: userMilestone.unlockedDate ? userMilestone.unlockedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
